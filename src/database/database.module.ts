import { Global, Module } from '@nestjs/common';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import * as schema from './schema/index.js';
import { DRIZZLE } from './database.constants.js';
import { DatabaseBootstrapService } from './database-bootstrap.service.js';

function resolveDatabasePath(): string {
  const url = process.env.DATABASE_URL ?? 'file:./data/sqlite.db';
  return url.startsWith('file:') ? url.slice('file:'.length) : url;
}

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const dbPath = resolveDatabasePath();
        mkdirSync(dirname(dbPath), { recursive: true });
        const sqlite = new Database(dbPath);
        sqlite.pragma('journal_mode = WAL');
        return drizzle(sqlite, { schema });
      },
    },
    DatabaseBootstrapService,
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
