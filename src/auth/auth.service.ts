import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { DRIZZLE } from '../database/database.constants.js';
import * as schema from '../database/schema/index.js';
import { users } from '../database/schema/users.js';
import type { AuthenticatedUser, JwtPayload } from './auth.types.js';
import { LoginInput } from './login.input.js';
import { RegisterInput } from './register.input.js';
import { UserRole } from './user-role.enum.js';
import { User } from './user.entity.js';
import { AuthPayload } from './auth-payload.entity.js';

type DrizzleDB = BetterSQLite3Database<typeof schema>;

const INVALID_CREDENTIALS = 'Invalid email or password';
const INACTIVE_ACCOUNT = 'Account is inactive';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
  ) {}

  toUser(row: typeof users.$inferSelect): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as UserRole,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      inactivatedAt: row.inactivatedAt,
      inactivatedBy: row.inactivatedBy,
    };
  }

  toAuthenticatedUser(row: typeof users.$inferSelect): AuthenticatedUser {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as UserRole,
      tokenVersion: row.tokenVersion,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      inactivatedAt: row.inactivatedAt,
      inactivatedBy: row.inactivatedBy,
    };
  }

  async register(input: RegisterInput): Promise<AuthPayload> {
    const email = input.email.trim().toLowerCase();
    const [existing] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(input.password, 10);
    const [row] = await this.db
      .insert(users)
      .values({
        name: input.name.trim(),
        email,
        passwordHash,
        role: 'user',
        tokenVersion: 0,
        status: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return this.buildAuthPayload(row);
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const email = input.email.trim().toLowerCase();
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!row) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const valid = await bcrypt.compare(input.password, row.passwordHash);
    if (!valid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (!row.status) {
      throw new UnauthorizedException(INACTIVE_ACCOUNT);
    }

    return this.buildAuthPayload(row);
  }

  async logout(userId: number): Promise<boolean> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!row) {
      throw new UnauthorizedException();
    }

    await this.db
      .update(users)
      .set({
        tokenVersion: row.tokenVersion + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    return true;
  }

  async findAllUsers(): Promise<User[]> {
    const rows = await this.db.select().from(users).orderBy(users.id);
    return rows.map((row) => this.toUser(row));
  }

  async setUserStatus(
    actorId: number,
    targetUserId: number,
    status: boolean,
  ): Promise<User> {
    const [target] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (!target) {
      throw new NotFoundException(`User with id ${targetUserId} not found`);
    }

    if (!status && target.role === 'super') {
      throw new BadRequestException('The super user cannot be inactivated');
    }

    if (target.status === status) {
      return this.toUser(target);
    }

    const now = new Date().toISOString();

    if (!status) {
      const [row] = await this.db
        .update(users)
        .set({
          status: false,
          inactivatedBy: actorId,
          inactivatedAt: now,
          updatedAt: now,
          tokenVersion: target.tokenVersion + 1,
        })
        .where(eq(users.id, targetUserId))
        .returning();
      return this.toUser(row);
    }

    const [row] = await this.db
      .update(users)
      .set({
        status: true,
        inactivatedBy: null,
        inactivatedAt: null,
        updatedAt: now,
      })
      .where(eq(users.id, targetUserId))
      .returning();

    return this.toUser(row);
  }

  async validateJwtPayload(payload: JwtPayload): Promise<AuthenticatedUser> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!row) {
      throw new UnauthorizedException();
    }

    if (!row.status) {
      throw new UnauthorizedException();
    }

    if (row.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException();
    }

    return this.toAuthenticatedUser(row);
  }

  private buildAuthPayload(row: typeof users.$inferSelect): AuthPayload {
    const user = this.toUser(row);
    const accessToken = this.jwtService.sign({
      sub: row.id,
      role: row.role,
      tokenVersion: row.tokenVersion,
    });

    return { accessToken, user };
  }
}
