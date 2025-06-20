import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Plan } from "../types";

const createdAt = int()
  .$defaultFn(() => Date.now())
  .notNull();
const updatedAt = int()
  .notNull()
  .$defaultFn(() => Date.now());

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  createdAt,
});

export type SUser = typeof usersTable.$inferSelect;

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  telegramData: one(telegramDataTable),
  subscriptions: many(subscriptionsTable),
  keys: many(keysTable),
}));

export const subscriptionsTable = sqliteTable("subscriptions", {
  id: int().primaryKey({ autoIncrement: true }),
  ownerId: int().notNull(),
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

export type SSubscription = typeof subscriptionsTable.$inferSelect;

export const subscriptionsRelations = relations(
  subscriptionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [subscriptionsTable.ownerId],
      references: [usersTable.id],
    }),
  })
);

export const telegramDataTable = sqliteTable("telegram_data", {
  ownerId: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  id: int().notNull(),
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
  ownerId: int().notNull(),
  key: text().notNull(),
  createdAt,
  updatedAt,
});

export const keysTableRelations = relations(keysTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [keysTable.ownerId],
    references: [usersTable.id],
  }),
}));
