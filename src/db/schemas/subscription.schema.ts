import { int, sqliteTable } from 'drizzle-orm/sqlite-core';
import { $UsersSchema } from './user.schema';
import { created_at, updated_at } from './share';
import { relations } from 'drizzle-orm';
import { $PaymentDataSchema } from './payment.schema';
import { $SubscriptionTypeSchema } from './subscriptionType.schema';

export const $SubscriptionsSchema = sqliteTable('subscriptions', {
    id: int().primaryKey({ autoIncrement: true }),
    owner_id: int()
        .notNull()
        .references(() => $UsersSchema.id, {
            onDelete: 'cascade',
        }),
    payment_id: int()
        .notNull()
        .references(() => $PaymentDataSchema.id, {
            onDelete: 'cascade',
        }),
    type_id: int()
        .notNull()
        .references(() => $SubscriptionTypeSchema.id),
    closed: int({ mode: 'boolean' }).notNull().default(false),
    created_at,
    updated_at,
});

export type SelectSubscription = typeof $SubscriptionsSchema.$inferSelect;
export type InsertSubscription = typeof $SubscriptionsSchema.$inferInsert;

export const SubscriptionsRelations = relations(
    $SubscriptionsSchema,
    ({ one }) => ({
        owner: one($UsersSchema, {
            fields: [$SubscriptionsSchema.owner_id],
            references: [$UsersSchema.id],
        }),
        payment_data: one($PaymentDataSchema, {
            fields: [$SubscriptionsSchema.payment_id],
            references: [$PaymentDataSchema.id],
        }),
        type: one($SubscriptionTypeSchema, {
            fields: [$SubscriptionsSchema.type_id],
            references: [$SubscriptionTypeSchema.id],
        }),
    })
);
