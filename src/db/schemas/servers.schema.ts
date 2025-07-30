import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Plan, Protocol } from 'types';
import { $AdminSecretSchema } from './secrets.schema';

export const $ServersSchema = sqliteTable('servers', {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    // ip: text().notNull(),
    // domain: text(),
    protocols: text({ mode: 'json' }).$type<Protocol[]>(),
    max_keys: int().notNull(),
    credentials: int().references(() => $AdminSecretSchema.id, {
        onDelete: 'cascade',
    }),
    // keys: text({ mode: 'json' }).$type<string[]>()
});

export const ServersRelations = relations($ServersSchema, ({ many, one }) => ({
    // keys: many($KeysSchema),

    credentials: one($AdminSecretSchema, {
        fields: [$ServersSchema.credentials],
        references: [$AdminSecretSchema.id],
    }),
}));
