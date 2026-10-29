import bcrypt from 'bcrypt';
import { eq, isNull } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { movements } from './schema/movements.js';
import { users } from './schema/users.js';
import {
  closeTestDb,
  createTestDb,
  type TestSqlite,
} from '../../test/helpers/sqlite.js';
import { DatabaseBootstrapService } from './database-bootstrap.service.js';

// Prueba creación del super al arranque y backfill de movimientos sin dueño.
describe('DatabaseBootstrapService', () => {
  let testDb: TestSqlite;
  let service: DatabaseBootstrapService;
  const envBackup = {
    SUPER_EMAIL: process.env.SUPER_EMAIL,
    SUPER_PASSWORD: process.env.SUPER_PASSWORD,
  };

  beforeEach(() => {
    testDb = createTestDb();
    service = new DatabaseBootstrapService(testDb.db);
    process.env.SUPER_EMAIL = 'bootstrap-super@test.com';
    process.env.SUPER_PASSWORD = 'super-pass-123';
  });

  afterEach(() => {
    process.env.SUPER_EMAIL = envBackup.SUPER_EMAIL;
    process.env.SUPER_PASSWORD = envBackup.SUPER_PASSWORD;
    closeTestDb(testDb.sqlite);
  });

  it('crea el usuario super si no existe ninguno en la base', async () => {
    await service.onModuleInit();

    const rows = await testDb.db
      .select()
      .from(users)
      .where(eq(users.role, 'super'));
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe('bootstrap-super@test.com');
    expect(rows[0].role).toBe('super');
  });

  it('no duplica el super si ya hay uno registrado', async () => {
    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash('x', 10);
    await testDb.db.insert(users).values({
      name: 'Existing Super',
      email: 'existing-super@test.com',
      passwordHash,
      role: 'super',
      tokenVersion: 0,
      status: true,
      createdAt: now,
      updatedAt: now,
    });

    await service.onModuleInit();

    const rows = await testDb.db
      .select()
      .from(users)
      .where(eq(users.role, 'super'));
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe('existing-super@test.com');
  });

  it('asigna movimientos sin userId al super tras el bootstrap', async () => {
    const now = new Date().toISOString();
    await testDb.db.insert(movements).values({
      description: 'Huérfano',
      amount: 10,
      type: 'expense',
      category: 'misc',
      date: '2025-01-01',
      createdAt: now,
      userId: null,
    });

    await service.onModuleInit();

    const [superRow] = await testDb.db
      .select()
      .from(users)
      .where(eq(users.role, 'super'));
    const orphanRows = await testDb.db
      .select()
      .from(movements)
      .where(isNull(movements.userId));

    expect(orphanRows).toHaveLength(0);
    const [assigned] = await testDb.db.select().from(movements);
    expect(assigned.userId).toBe(superRow.id);
  });

  it('falla al arrancar si no hay super y faltan SUPER_EMAIL o SUPER_PASSWORD', async () => {
    delete process.env.SUPER_EMAIL;
    delete process.env.SUPER_PASSWORD;

    await expect(service.onModuleInit()).rejects.toThrow(
      'SUPER_EMAIL and SUPER_PASSWORD are required',
    );
  });
});
