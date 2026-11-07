import {
  doublePrecision,
  index,
  integer,
  pgTable,
  text,
} from 'drizzle-orm/pg-core';
import { movements } from './movements.js';

export const movementItems = pgTable(
  'movement_items',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    movementId: integer('movement_id')
      .notNull()
      .references(() => movements.id),
    name: text('name').notNull(),
    price: doublePrecision('price').notNull(),
    subcategory: text('subcategory').notNull(),
    position: integer('position').notNull(),
  },
  (table) => [
    index('movement_items_movement_id_idx').on(table.movementId),
  ],
);

export type MovementItemRow = typeof movementItems.$inferSelect;
export type NewMovementItem = typeof movementItems.$inferInsert;
