import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { UserRole } from '../auth/user-role.enum.js';
import { movementItems } from '../database/schema/movement-items.js';
import { users } from '../database/schema/users.js';
import { movements } from '../database/schema/movements.js';
import {
  closeTestDb,
  createTestDb,
  type TestSqlite,
} from '../../test/helpers/sqlite.js';
import { MovementType } from './movement.entity.js';
import { MovementsService } from './movements.service.js';

async function insertUser(
  db: TestSqlite['db'],
  data: {
    name: string;
    email: string;
    role?: 'user' | 'super';
  },
) {
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash('pass', 10);
  const [row] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role ?? 'user',
      tokenVersion: 0,
      status: true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return row;
}

function toAuthUser(row: typeof users.$inferSelect): AuthenticatedUser {
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

async function insertMovement(
  db: TestSqlite['db'],
  data: {
    userId: number;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    deletedAt?: string | null;
  },
) {
  const [row] = await db
    .insert(movements)
    .values({
      userId: data.userId,
      description: data.description,
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: data.date,
      createdAt: new Date().toISOString(),
      deletedAt: data.deletedAt ?? null,
    })
    .returning();
  return row;
}

// Prueba CRUD de movimientos, aislamiento por usuario, filtros y agregados.
describe('MovementsService', () => {
  let testDb: TestSqlite;
  let service: MovementsService;
  let userA: AuthenticatedUser;
  let userB: AuthenticatedUser;
  let superUser: AuthenticatedUser;

  beforeEach(async () => {
    testDb = createTestDb();
    service = new MovementsService(testDb.db);

    const rowA = await insertUser(testDb.db, {
      name: 'Alice',
      email: 'alice@test.com',
    });
    const rowB = await insertUser(testDb.db, {
      name: 'Bob',
      email: 'bob@test.com',
    });
    const rowSuper = await insertUser(testDb.db, {
      name: 'Super',
      email: 'super@test.com',
      role: 'super',
    });

    userA = toAuthUser(rowA);
    userB = toAuthUser(rowB);
    superUser = toAuthUser(rowSuper);
  });

  afterEach(() => {
    closeTestDb(testDb.sqlite);
  });

  // create: el movimiento queda asociado al usuario autenticado.
  describe('create', () => {
    it('persiste un movimiento con userId del usuario autenticado', async () => {
      const movement = await service.create(userA, {
        description: 'Salario',
        amount: 5000,
        type: MovementType.income,
        category: 'work',
        date: '2025-01-15',
      });

      expect(movement.userId).toBe(userA.id);
      expect(movement.description).toBe('Salario');
      expect(movement.amount).toBe(5000);
    });
  });

  // findAll: visibilidad por rol, exclusión de borrados y filtros.
  describe('findAll', () => {
    beforeEach(async () => {
      await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'A income',
        amount: 100,
        type: 'income',
        category: 'salary',
        date: '2025-02-01',
      });
      await insertMovement(testDb.db, {
        userId: userB.id,
        description: 'B expense',
        amount: 50,
        type: 'expense',
        category: 'food',
        date: '2025-02-02',
      });
      await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'Deleted',
        amount: 1,
        type: 'expense',
        category: 'other',
        date: '2025-02-03',
        deletedAt: new Date().toISOString(),
      });
    });

    it('usuario normal solo ve sus movimientos no borrados', async () => {
      const list = await service.findAll(userA);
      expect(list).toHaveLength(1);
      expect(list[0].description).toBe('A income');
    });

    it('super ve movimientos de todos los usuarios (no borrados)', async () => {
      const list = await service.findAll(superUser);
      expect(list).toHaveLength(2);
      const owners = new Set(list.map((m) => m.userId));
      expect(owners.has(userA.id)).toBe(true);
      expect(owners.has(userB.id)).toBe(true);
    });

    it('aplica filtros por tipo, categoría y rango de fechas', async () => {
      await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'Old',
        amount: 10,
        type: 'income',
        category: 'bonus',
        date: '2024-12-01',
      });

      const byType = await service.findAll(userA, { type: MovementType.income });
      expect(byType.every((m) => m.type === MovementType.income)).toBe(true);

      const byCat = await service.findAll(userA, { category: 'salary' });
      expect(byCat).toHaveLength(1);

      const byDate = await service.findAll(userA, {
        fromDate: '2025-02-01',
        toDate: '2025-02-28',
      });
      expect(byDate).toHaveLength(1);
      expect(byDate[0].date).toBe('2025-02-01');
    });
  });

  // findOne: permisos por dueño y rol super.
  describe('findOne', () => {
    it('deniega acceso al movimiento de otro usuario con ForbiddenException', async () => {
      const row = await insertMovement(testDb.db, {
        userId: userB.id,
        description: 'Privado',
        amount: 1,
        type: 'expense',
        category: 'x',
        date: '2025-03-01',
      });

      await expect(service.findOne(userA, row.id)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('super puede leer cualquier movimiento por id', async () => {
      const row = await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'Any',
        amount: 2,
        type: 'income',
        category: 'y',
        date: '2025-03-02',
      });

      const movement = await service.findOne(superUser, row.id);
      expect(movement.id).toBe(row.id);
    });

    it('lanza NotFoundException si el id no existe o está borrado', async () => {
      await expect(service.findOne(userA, 99999)).rejects.toThrow(
        NotFoundException,
      );

      const deleted = await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'Gone',
        amount: 1,
        type: 'expense',
        category: 'z',
        date: '2025-03-03',
        deletedAt: new Date().toISOString(),
      });

      await expect(service.findOne(userA, deleted.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // update: campos parciales y control de acceso.
  describe('update', () => {
    it('actualiza solo los campos enviados en el input', async () => {
      const row = await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'Original',
        amount: 100,
        type: 'expense',
        category: 'food',
        date: '2025-04-01',
      });

      const updated = await service.update(userA, row.id, {
        description: 'Nuevo nombre',
        amount: 120,
      });

      expect(updated.description).toBe('Nuevo nombre');
      expect(updated.amount).toBe(120);
      expect(updated.category).toBe('food');
    });

    it('no permite actualizar movimiento de otro usuario', async () => {
      const row = await insertMovement(testDb.db, {
        userId: userB.id,
        description: 'Bob',
        amount: 10,
        type: 'expense',
        category: 'a',
        date: '2025-04-02',
      });

      await expect(
        service.update(userA, row.id, { description: 'Hack' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // remove: borrado lógico (soft delete).
  describe('remove', () => {
    it('marca deletedAt y el movimiento deja de aparecer en findOne', async () => {
      const row = await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'To delete',
        amount: 5,
        type: 'expense',
        category: 'misc',
        date: '2025-05-01',
      });

      const removed = await service.remove(userA, row.id);
      expect(removed.id).toBe(row.id);

      await expect(service.findOne(userA, row.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Agregados: resumen, por categoría y por mes con dueño y fechas.
  describe('agregados (getSummary, getByCategory, getByMonth)', () => {
    beforeEach(async () => {
      await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'In',
        amount: 1000,
        type: 'income',
        category: 'work',
        date: '2025-06-10',
      });
      await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'Out',
        amount: 300,
        type: 'expense',
        category: 'food',
        date: '2025-06-15',
      });
      await insertMovement(testDb.db, {
        userId: userB.id,
        description: 'Bob only',
        amount: 9999,
        type: 'income',
        category: 'other',
        date: '2025-06-20',
      });
      await insertMovement(testDb.db, {
        userId: userA.id,
        description: 'Deleted sum',
        amount: 5000,
        type: 'income',
        category: 'work',
        date: '2025-06-25',
        deletedAt: new Date().toISOString(),
      });
    });

    it('getSummary calcula ingresos, gastos y balance solo del usuario en el rango', async () => {
      const summary = await service.getSummary(
        userA,
        '2025-06-01',
        '2025-06-30',
      );

      expect(summary.totalIncome).toBe(1000);
      expect(summary.totalExpense).toBe(300);
      expect(summary.balance).toBe(700);
    });

    it('getByCategory agrupa totales por categoría respetando dueño y fechas', async () => {
      const rows = await service.getByCategory(
        userA,
        '2025-06-01',
        '2025-06-30',
      );

      const work = rows.find((r) => r.category === 'work');
      const food = rows.find((r) => r.category === 'food');
      expect(work?.totalIncome).toBe(1000);
      expect(food?.totalExpense).toBe(300);
      expect(rows.some((r) => r.category === 'other')).toBe(false);
    });

    it('getByMonth agrupa por mes (YYYY-MM) con ingresos y gastos del usuario', async () => {
      const rows = await service.getByMonth(
        userA,
        '2025-06-01',
        '2025-06-30',
      );

      expect(rows).toHaveLength(1);
      expect(rows[0].month).toBe('2025-06');
      expect(rows[0].totalIncome).toBe(1000);
      expect(rows[0].totalExpense).toBe(300);
    });
  });

  // Ítems: desglose opcional. La suma no puede pasar el amount del encabezado.
  describe('items', () => {
    const header = {
      description: 'Super',
      amount: 100,
      type: MovementType.expense,
      category: 'food',
      date: '2025-08-01',
    };

    it('guarda el desglose, recorta textos y no cambia el amount', async () => {
      const movement = await service.create(userA, {
        ...header,
        items: [
          { name: '  Leche  ', price: 25, subcategory: '  lácteos  ' },
          { name: 'Pan', price: 15, subcategory: 'panadería' },
        ],
      });

      expect(movement.amount).toBe(100);
      const items = await service.findItems(userA, movement.id);
      expect(items).toEqual([
        expect.objectContaining({
          name: 'Leche',
          price: 25,
          subcategory: 'lácteos',
          position: 0,
        }),
        expect.objectContaining({
          name: 'Pan',
          price: 15,
          subcategory: 'panadería',
          position: 1,
        }),
      ]);
    });

    it('acepta suma igual al amount, también con decimales de centavo', async () => {
      const exact = await service.create(userA, {
        ...header,
        amount: 40,
        items: [
          { name: 'A', price: 25, subcategory: 'a' },
          { name: 'B', price: 15, subcategory: 'b' },
        ],
      });
      expect(exact.amount).toBe(40);

      const cents = await service.create(userA, {
        ...header,
        description: 'Decimales',
        amount: 20.3,
        items: [
          { name: 'A', price: 10.1, subcategory: 'a' },
          { name: 'B', price: 10.2, subcategory: 'b' },
        ],
      });
      expect(cents.amount).toBe(20.3);
    });

    it('rechaza suma mayor que amount, incluido el cruce por un centavo', async () => {
      await expect(
        service.create(userA, {
          ...header,
          amount: 30,
          items: [
            { name: 'A', price: 20, subcategory: 'a' },
            { name: 'B', price: 15, subcategory: 'b' },
          ],
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.create(userA, {
          ...header,
          amount: 20.3,
          items: [
            { name: 'A', price: 10.1, subcategory: 'a' },
            { name: 'B', price: 10.21, subcategory: 'b' },
          ],
        }),
      ).rejects.toThrow('Item total exceeds movement amount');
    });

    it('rechaza nombre, subcategoría o precio inválidos', async () => {
      await expect(
        service.create(userA, {
          ...header,
          items: [{ name: '   ', price: 1, subcategory: 'a' }],
        }),
      ).rejects.toThrow('Item name is required');

      await expect(
        service.create(userA, {
          ...header,
          items: [{ name: 'A', price: 1, subcategory: '   ' }],
        }),
      ).rejects.toThrow('Item subcategory is required');

      await expect(
        service.create(userA, {
          ...header,
          items: [{ name: 'A', price: 0, subcategory: 'a' }],
        }),
      ).rejects.toThrow('Item price must be greater than zero');

      await expect(
        service.create(userA, {
          ...header,
          items: [{ name: 'A'.repeat(201), price: 1, subcategory: 'a' }],
        }),
      ).rejects.toThrow('Item name is too long');
    });

    it('reemplaza la lista, y omitirla no la borra', async () => {
      const movement = await service.create(userA, {
        ...header,
        items: [{ name: 'Leche', price: 25, subcategory: 'lácteos' }],
      });

      await service.update(userA, movement.id, {
        description: 'Super semanal',
      });
      const kept = await service.findItems(userA, movement.id);
      expect(kept).toHaveLength(1);
      expect(kept[0].name).toBe('Leche');

      await service.update(userA, movement.id, {
        items: [{ name: 'Pan', price: 10, subcategory: 'panadería' }],
      });
      const replaced = await service.findItems(userA, movement.id);
      expect(replaced).toHaveLength(1);
      expect(replaced[0].name).toBe('Pan');
      const current = await service.findOne(userA, movement.id);
      expect(current.description).toBe('Super semanal');
      expect(current.amount).toBe(100);
    });

    it('items vacío borra el desglose y permite bajar amount', async () => {
      const movement = await service.create(userA, {
        ...header,
        items: [{ name: 'Leche', price: 25, subcategory: 'lácteos' }],
      });

      const updated = await service.update(userA, movement.id, {
        items: [],
        amount: 10,
      });
      expect(updated.amount).toBe(10);
      expect(await service.findItems(userA, movement.id)).toEqual([]);
    });

    it('rechaza bajar amount por debajo de la suma guardada', async () => {
      const movement = await service.create(userA, {
        ...header,
        items: [{ name: 'Leche', price: 40, subcategory: 'lácteos' }],
      });

      await expect(
        service.update(userA, movement.id, { amount: 30 }),
      ).rejects.toThrow('Item total exceeds movement amount');

      const current = await service.findOne(userA, movement.id);
      expect(current.amount).toBe(100);
      expect(await service.findItems(userA, movement.id)).toHaveLength(1);
    });

    it('otro usuario no puede leer los items', async () => {
      const movement = await service.create(userA, {
        ...header,
        items: [{ name: 'Leche', price: 25, subcategory: 'lácteos' }],
      });

      await expect(service.findItems(userB, movement.id)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('el resumen suma el amount del encabezado, no los precios', async () => {
      await service.create(userA, {
        ...header,
        amount: 100,
        items: [{ name: 'Leche', price: 25, subcategory: 'lácteos' }],
      });

      const summary = await service.getSummary(userA, '2025-08-01', '2025-08-31');
      expect(summary.totalExpense).toBe(100);
      expect(summary.balance).toBe(-100);
    });

    it('el borrado del movimiento esconde los items y conserva las filas', async () => {
      const movement = await service.create(userA, {
        ...header,
        items: [{ name: 'Leche', price: 25, subcategory: 'lácteos' }],
      });

      await service.remove(userA, movement.id);

      await expect(service.findItems(userA, movement.id)).rejects.toThrow(
        NotFoundException,
      );
      const rows = await testDb.db
        .select()
        .from(movementItems)
        .where(eq(movementItems.movementId, movement.id));
      expect(rows).toHaveLength(1);
    });
  });
});
