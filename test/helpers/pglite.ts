import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { join } from 'node:path';
import type { DrizzleDB } from '../../src/database/drizzle-db.type.js';
import * as schema from '../../src/database/schema/index.js';

export type TestDb = {
  db: DrizzleDB;
  client: PGlite;
};

/** In-memory Postgres (PGlite): applies Drizzle migrations and returns the client for tests. */
export async function createTestDb(): Promise<TestDb> {
  const client = new PGlite();
  const db = drizzle(client, { schema }) as unknown as DrizzleDB;
  await migrate(db as Parameters<typeof migrate>[0], {
    migrationsFolder: join(process.cwd(), 'drizzle'),
  });
  return { db, client };
}

/** Closes the PGlite client after a test. */
export async function closeTestDb(client: PGlite): Promise<void> {
  await client.close();
}
