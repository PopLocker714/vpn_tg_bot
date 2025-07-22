import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { Plan } from 'types';

export const $SubscriptionTypeSchema = sqliteTable('subscription_types', {
    id: int().primaryKey({ autoIncrement: true }),
    type: text({
        enum: [Plan.FREE, Plan.SUBSCRIBE_1, Plan.SUBSCRIBE_2, Plan.SUBSCRIBE_3],
    }).$type<Plan>(),
});
