import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { $UsersSchema } from './user.schema';
import { created_at } from './share';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const $PaymentDataSchema = sqliteTable('payment_data', {
    id: int().primaryKey({ autoIncrement: true }),
    owner_id: int()
        .notNull()
        .references(() => $UsersSchema.id, { onDelete: 'cascade' }),
    payment_id: text().notNull(),
    provider: text(),
    created_at,
});

export const PaymentDataRelations = relations(
    $PaymentDataSchema,
    ({ one }) => ({
        owner: one($UsersSchema, {
            fields: [$PaymentDataSchema.owner_id],
            references: [$UsersSchema.id],
        }),
    })
);

export type SelectPayment = InferSelectModel<typeof $PaymentDataSchema>;
export type InsertPayment = InferInsertModel<typeof $PaymentDataSchema>;
