import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';

export const movements = sqliteTable('movements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
  createdAt: text('created_at').notNull(),
  deletedAt: text('deleted_at'),
});

export type Movement = typeof movements.$inferSelect;
export type NewMovement = typeof movements.$inferInsert;
