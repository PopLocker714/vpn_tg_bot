import { int, sqliteTable } from 'drizzle-orm/sqlite-core';
import { created_at } from './share';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { $TelegramDataSchema } from './telegramData.schema';
import { $SubscriptionsSchema } from './subscription.schema';
import { $PaymentDataSchema } from './payment.schema';

export const $UsersSchema = sqliteTable('users', {
    id: int().primaryKey({ autoIncrement: true }),
    created_at,
});

export const UsersRelations = relations($UsersSchema, ({ many }) => ({
    subscriptions: many($SubscriptionsSchema),
    payment_data: many($PaymentDataSchema),
}));

export type SelectUser = InferSelectModel<typeof $UsersSchema>;
export type InsertUser = InferInsertModel<typeof $UsersSchema>;

export interface SelectRelUser extends SelectUser {
    subscriptions?: InferSelectModel<typeof $SubscriptionsSchema>[];
    payment_data?: InferSelectModel<typeof $PaymentDataSchema>[];
    telegram_data?: InferSelectModel<typeof $TelegramDataSchema>;
}
