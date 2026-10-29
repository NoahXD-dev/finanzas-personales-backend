import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { eq, isNull } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import bcrypt from 'bcrypt';
import { DRIZZLE } from './database.constants.js';
import * as schema from './schema/index.js';
import { movements } from './schema/movements.js';
import { users } from './schema/users.js';

type DrizzleDB = BetterSQLite3Database<typeof schema>;

@Injectable()
export class DatabaseBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseBootstrapService.name);

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async onModuleInit(): Promise<void> {
    const superUser = await this.ensureSuperUser();
    await this.backfillMovementOwners(superUser.id);
  }

  private async ensureSuperUser(): Promise<typeof users.$inferSelect> {
    const [existing] = await this.db
      .select()
      .from(users)
      .where(eq(users.role, 'super'))
      .limit(1);

    if (existing) {
      return existing;
    }

    const email = process.env.SUPER_EMAIL?.trim().toLowerCase();
    const password = process.env.SUPER_PASSWORD;
    if (!email || !password) {
      throw new Error(
        'SUPER_EMAIL and SUPER_PASSWORD are required to create the initial super user',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const [created] = await this.db
      .insert(users)
      .values({
        name: 'Super Admin',
        email,
        passwordHash,
        role: 'super',
        tokenVersion: 0,
        status: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    this.logger.log(`Created super user (${email})`);
    return created;
  }

  private async backfillMovementOwners(superUserId: number): Promise<void> {
    const result = await this.db
      .update(movements)
      .set({ userId: superUserId })
      .where(isNull(movements.userId))
      .returning({ id: movements.id });

    if (result.length > 0) {
      this.logger.log(
        `Assigned ${result.length} existing movement(s) to super user`,
      );
    }
  }
}
