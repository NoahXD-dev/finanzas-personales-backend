import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { join } from 'node:path';
import * as schema from '../../src/database/schema/index.js';

export type TestSqlite = {
  db: ReturnType<typeof drizzle<typeof schema>>;
  sqlite: Database.Database;
};

/** Abre SQLite en memoria, aplica migraciones Drizzle y devuelve la conexión para tests. */
export function createTestDb(): TestSqlite {
  const sqlite = new Database(':memory:');
  sqlite.pragma('journal_mode = WAL');
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') });
  return { db, sqlite };
}

/** Cierra la conexión SQLite de un test. */
export function closeTestDb(sqlite: Database.Database): void {
  sqlite.close();
}
