import {
  type AnySQLiteColumn,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const userRoles = ['user', 'super'] as const;
export type UserRole = (typeof userRoles)[number];

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: text('role', { enum: userRoles }).notNull().default('user'),
    tokenVersion: integer('token_version').notNull().default(0),
    status: integer('status', { mode: 'boolean' }).notNull().default(true),
    inactivatedBy: integer('inactivated_by').references(
      (): AnySQLiteColumn => users.id,
    ),
    inactivatedAt: text('inactivated_at'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    uniqueIndex('users_single_super_idx')
      .on(table.role)
      .where(sql`${table.role} = 'super'`),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
