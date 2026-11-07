import {
  Global,
  Inject,
  Injectable,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.js';
import { DRIZZLE, PG_POOL } from './database.constants.js';
import { DatabaseBootstrapService } from './database-bootstrap.service.js';
import type { DrizzleDB } from './drizzle-db.type.js';

function resolvePostgresUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (
    !url ||
    (!url.startsWith('postgres://') && !url.startsWith('postgresql://'))
  ) {
    throw new Error(
      'DATABASE_URL must be a PostgreSQL connection string (postgres:// or postgresql://)',
    );
  }
  return url;
}

@Injectable()
class PgPoolLifecycle implements OnModuleDestroy {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => new Pool({ connectionString: resolvePostgresUrl() }),
    },
    {
      provide: DRIZZLE,
      useFactory: (pool: Pool): DrizzleDB => drizzle(pool, { schema }),
      inject: [PG_POOL],
    },
    PgPoolLifecycle,
    DatabaseBootstrapService,
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
