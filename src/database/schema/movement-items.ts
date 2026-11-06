import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { movements } from './movements.js';

export const movementItems = sqliteTable(
  'movement_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    movementId: integer('movement_id')
      .notNull()
      .references(() => movements.id),
    name: text('name').notNull(),
    price: real('price').notNull(),
    subcategory: text('subcategory').notNull(),
    position: integer('position').notNull(),
  },
  (table) => [
    index('movement_items_movement_id_idx').on(table.movementId),
  ],
);

export type MovementItemRow = typeof movementItems.$inferSelect;
export type NewMovementItem = typeof movementItems.$inferInsert;
