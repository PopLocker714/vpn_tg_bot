import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { $UsersSchema } from './user.schema';

export const $TelegramDataSchema = sqliteTable('telegram_data', {
    id: int().primaryKey({ autoIncrement: true }),
    tg_id: int().notNull(),
    first_name: text(),
    last_name: text(),
    username: text().notNull(),
    chat_id: int().notNull(),
    owner_id: int()
        .notNull()
        .references(() => $UsersSchema.id, { onDelete: 'cascade' }),
});

export const TelegramDataRelations = relations(
    $TelegramDataSchema,
    ({ one }) => ({
        owner: one(
            $UsersSchema,
            {
                fields: [$TelegramDataSchema.owner_id],
                references: [$UsersSchema.id],
            },
        ),
    })
);

export type SelectTelegramData = InferSelectModel<typeof $TelegramDataSchema>;
// export type SelectRelTelegramData = InferSelectModel<
//     typeof TelegramDataRelations.table
// >;
export type InsertTelegramData = InferInsertModel<typeof $TelegramDataSchema>;
