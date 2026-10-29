import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { UserRole } from '../auth/user-role.enum.js';
import { and, eq, gte, isNull, lte, sql } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { DRIZZLE } from '../database/database.constants.js';
import * as schema from '../database/schema/index.js';
import { movements } from '../database/schema/movements.js';
import { CreateMovementInput } from './create-movement.input.js';
import {
  MovementByCategory,
  MovementByMonth,
  MovementFilterInput,
  MovementSummary,
} from './movement-summary.entity.js';
import { Movement, MovementType } from './movement.entity.js';
import { UpdateMovementInput } from './update-movement.input.js';

type DrizzleDB = BetterSQLite3Database<typeof schema>;

@Injectable()
export class MovementsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /* Converts a database row to a movement entity */
  /* @param row - The database row
   * @returns The movement entity
   */
  private toMovement(row: typeof movements.$inferSelect): Movement {
    if (row.userId == null) {
      throw new NotFoundException('Movement owner is missing');
    }
    return {
      id: row.id,
      description: row.description,
      amount: row.amount,
      type: row.type as MovementType,
      category: row.category,
      date: row.date,
      createdAt: row.createdAt,
      userId: row.userId,
    };
  }

  private isSuper(user: AuthenticatedUser): boolean {
    return user.role === UserRole.super;
  }

  private assertCanAccess(
    row: typeof movements.$inferSelect,
    user: AuthenticatedUser,
  ): void {
    if (this.isSuper(user)) {
      return;
    }
    if (row.userId !== user.id) {
      throw new ForbiddenException();
    }
  }

  /* Builds the date filters for the query */
  /* @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   * @returns An array of date filters
   */
  private buildDateFilters(fromDate?: string, toDate?: string) {
    const conditions = [];
    if (fromDate) {
      conditions.push(gte(movements.date, fromDate));
    }
    if (toDate) {
      conditions.push(lte(movements.date, toDate));
    }
    return conditions;
  }

  /* Builds the filter conditions for the query */
  /* @param filter - The filter input
   * @returns An array of filter conditions
   */
  private buildFilterConditions(
    user: AuthenticatedUser,
    filter?: MovementFilterInput,
  ) {
    const conditions = [isNull(movements.deletedAt)];
    if (!this.isSuper(user)) {
      conditions.push(eq(movements.userId, user.id));
    }
    conditions.push(...this.buildDateFilters(filter?.fromDate, filter?.toDate));
    if (filter?.type) {
      conditions.push(eq(movements.type, filter.type));
    }
    if (filter?.category) {
      conditions.push(eq(movements.category, filter.category));
    }
    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  /* Finds all movements */
  /* @param filter - The filter input
   * @returns An array of movements
   */
  async findAll(
    user: AuthenticatedUser,
    filter?: MovementFilterInput,
  ): Promise<Movement[]> {
    const where = this.buildFilterConditions(user, filter);
    const rows = await this.db
      .select()
      .from(movements)
      .where(where)
      .orderBy(movements.date);
    return rows.map((row) => this.toMovement(row));
  }

  /* Finds a movement by id */
  /* @param id - The id of the movement
   * @returns The movement
   */
  async findOne(user: AuthenticatedUser, id: number): Promise<Movement> {
    const [row] = await this.db
      .select()
      .from(movements)
      .where(and(eq(movements.id, id), isNull(movements.deletedAt)));
    if (!row) {
      throw new NotFoundException(`Movement with id ${id} not found`);
    }
    this.assertCanAccess(row, user);
    return this.toMovement(row);
  }

  /* Creates a new movement */
  /* @param input - The input for the movement
   * @returns The created movement
   */
  async create(
    user: AuthenticatedUser,
    input: CreateMovementInput,
  ): Promise<Movement> {
    const [row] = await this.db
      .insert(movements)
      .values({
        userId: user.id,
        description: input.description,
        amount: input.amount,
        type: input.type,
        category: input.category,
        date: input.date,
        createdAt: new Date().toISOString(),
      })
      .returning();
    return this.toMovement(row);
  }

  /* Updates a movement */
  /* @param id - The id of the movement
   * @param input - The input for the movement
   * @returns The updated movement
   */
  async update(
    user: AuthenticatedUser,
    id: number,
    input: UpdateMovementInput,
  ): Promise<Movement> {
    await this.findOne(user, id);
    const [row] = await this.db
      .update(movements)
      .set({
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.amount !== undefined && { amount: input.amount }),
        ...(input.type !== undefined && { type: input.type }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.date !== undefined && { date: input.date }),
      })
      .where(eq(movements.id, id))
      .returning();
    return this.toMovement(row);
  }

  /* Removes a movement */
  /* @param id - The id of the movement
   * @returns The removed movement
   */
  async remove(user: AuthenticatedUser, id: number): Promise<Movement> {
    const existing = await this.findOne(user, id);
    await this.db
      .update(movements)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(movements.id, id));
    return existing;
  }

  /* Gets the summary of the movements */
  /* @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   * @returns The summary of the movements
   */
  async getSummary(
    user: AuthenticatedUser,
    fromDate: string,
    toDate: string,
  ): Promise<MovementSummary> {
    const conditions = [
      isNull(movements.deletedAt),
      gte(movements.date, fromDate),
      lte(movements.date, toDate),
    ];
    if (!this.isSuper(user)) {
      conditions.push(eq(movements.userId, user.id));
    }
    const where = and(...conditions);
    const [result] = await this.db
      .select({
        totalIncome: sql<number>`coalesce(sum(case when ${movements.type} = 'income' then ${movements.amount} else 0 end), 0)`,
        totalExpense: sql<number>`coalesce(sum(case when ${movements.type} = 'expense' then ${movements.amount} else 0 end), 0)`,
      })
      .from(movements)
      .where(where);

    const totalIncome = result?.totalIncome ?? 0;
    const totalExpense = result?.totalExpense ?? 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  /* Gets the movements by category */
  /* @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   * @returns An array of movements by category
   */
  async getByCategory(
    user: AuthenticatedUser,
    fromDate?: string,
    toDate?: string,
  ): Promise<MovementByCategory[]> {
    const where = this.buildFilterConditions(user, { fromDate, toDate });
    const rows = await this.db
      .select({
        category: movements.category,
        totalIncome: sql<number>`coalesce(sum(case when ${movements.type} = 'income' then ${movements.amount} else 0 end), 0)`,
        totalExpense: sql<number>`coalesce(sum(case when ${movements.type} = 'expense' then ${movements.amount} else 0 end), 0)`,
      })
      .from(movements)
      .where(where)
      .groupBy(movements.category)
      .orderBy(movements.category);

    return rows;
  }

  /* Gets the movements by month */
  /* @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   * @returns An array of movements by month
   */
  async getByMonth(
    user: AuthenticatedUser,
    fromDate?: string,
    toDate?: string,
  ): Promise<MovementByMonth[]> {
    const where = this.buildFilterConditions(user, { fromDate, toDate });
    const monthExpr = sql<string>`substr(${movements.date}, 1, 7)`;
    const rows = await this.db
      .select({
        month: monthExpr,
        totalIncome: sql<number>`coalesce(sum(case when ${movements.type} = 'income' then ${movements.amount} else 0 end), 0)`,
        totalExpense: sql<number>`coalesce(sum(case when ${movements.type} = 'expense' then ${movements.amount} else 0 end), 0)`,
      })
      .from(movements)
      .where(where)
      .groupBy(monthExpr)
      .orderBy(monthExpr);

    return rows;
  }
}
