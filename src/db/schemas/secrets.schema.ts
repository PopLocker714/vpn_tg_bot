import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, int } from 'drizzle-orm/sqlite-core';
import { created_at, updated_at } from './share';

// Определение таблицы для зашифрованных административных секретов
export const $AdminSecretSchema = sqliteTable('admin_secrets', {
    id: int().primaryKey({ autoIncrement: true }),
    encryptedData: text('encrypted_data').notNull(),
    iv: text('iv').notNull(),
    authTag: text('auth_tag').notNull(),
    salt: text('salt').notNull(),
    iterations: integer('iterations').notNull(), // Храним как число
    hashAlgorithm: text('hash_algorithm').notNull(),
    description: text('description'),
    created_at,
    updated_at,
    // server_id: int()
    //     .notNull()
    //     .references(() => $ServersSchema.id, { onDelete: 'cascade' }),
});

// export const AdminSecretRelations = relations(
//     $AdminSecretSchema,
//     ({ one }) => ({
//         owner: one($ServersSchema, {
//             fields: [$AdminSecretSchema.server_id],
//             references: [$ServersSchema.id],
//         }),
//     })
// );

export type SelectAdminSecret = InferSelectModel<typeof $AdminSecretSchema>;
export type InsertAdminSecret = InferInsertModel<typeof $AdminSecretSchema>;
