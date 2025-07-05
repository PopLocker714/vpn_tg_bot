import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { PaymentTypeProvider, Plan } from "../types";

const createdAt = int()
  .$defaultFn(() => Date.now())
  .notNull();

const updatedAt = int()
  .notNull()
  .$defaultFn(() => Date.now())
  .$onUpdateFn(() => Date.now());

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  createdAt,
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  telegramData: one(telegramDataTable, {
    fields: [usersTable.id],
    references: [telegramDataTable.ownerId],
  }),
  subscriptions: many(subscriptionsTable),
  keys: many(keysTable),
  paymentData: many(paymentDataTable),
}));

export const subscriptionsTable = sqliteTable("subscriptions", {
  id: int().primaryKey({ autoIncrement: true }),
  ownerId: int()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  paymentDataId: int().notNull(),
  plan: text({
    enum: [Plan.FREE, Plan.MONTH, Plan.THREE_MONTH, Plan.YEAR],
  })
    .notNull()
    .$type<Plan>(),
  createdAt,
  updatedAt,
  expired: int({ mode: "boolean" })
    .$default(() => false)
    .notNull(),
});

export const subscriptionsRelations = relations(
  subscriptionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [subscriptionsTable.ownerId],
      references: [usersTable.id],
    }),
    paymentData: one(paymentDataTable, {
      fields: [subscriptionsTable.paymentDataId],
      references: [paymentDataTable.id],
    }),
  })
);

export const telegramDataTable = sqliteTable("telegram_data", {
  id: int().notNull(),
  ownerId: int().notNull(),
  chatId: int().notNull(),
  firstName: text(),
  lastName: text(),
  username: text().notNull(),
});

export const telegramDataRelations = relations(
  telegramDataTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [telegramDataTable.ownerId],
      references: [usersTable.id],
    }),
  })
);

export const vpnServersTable = sqliteTable("vpn_servers", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  ip: text().notNull(),
  location: text().notNull(),
  createdAt,
  updatedAt,
});

export const keysTable = sqliteTable("keys", {
  id: int().primaryKey({ autoIncrement: true }),
  ownerId: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  key: text().notNull(),
  createdAt,
  updatedAt,
});

export const keysTableRelations = relations(keysTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [keysTable.ownerId],
    references: [usersTable.id],
  }),
}));

export const paymentDataTable = sqliteTable("payment_data", {
  id: int().primaryKey({ autoIncrement: true }),
  ownerId: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  typeProvider: text({
    enum: [PaymentTypeProvider.FREE, PaymentTypeProvider.YKASSA],
  })
    .notNull()
    .$type<PaymentTypeProvider>(),
  typeSubscription: text({
    enum: [Plan.FREE, Plan.MONTH, Plan.THREE_MONTH, Plan.YEAR],
  })
    .notNull()
    .$type<Plan>(),
  paymentId: text().notNull(),
  createdAt,
  updatedAt,
});

export const paymentDataRelations = relations(paymentDataTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [paymentDataTable.ownerId],
    references: [usersTable.id],
  }),
}));

export type SPaymentData = typeof paymentDataTable.$inferSelect;
export type SSubscription = typeof subscriptionsTable.$inferSelect;
export type SUser = typeof usersTable.$inferSelect;
