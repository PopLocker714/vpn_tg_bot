import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Plan, Protocol } from 'types';

export const $ServersSchema = sqliteTable('servers', {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    ip: text().notNull(),
    domain: text(),
    protocols: text({ mode: 'json' }).$type<Protocol[]>(),
    max_keys: int().notNull(),
    // keys: text({ mode: 'json' }).$type<string[]>()
});

export const ServersRelations = relations($ServersSchema, ({ many }) => ({
    // keys: many($KeysSchema),
}));
