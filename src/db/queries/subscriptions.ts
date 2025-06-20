import { eq } from "drizzle-orm";
import { db } from "..";
import { SSubscription, subscriptionsTable } from "../schema";
import { Plan } from "../../types";

export const getSubscriptions = async (userId: number) => {
  return await db.query.subscriptionsTable.findMany({
    where: (table) => eq(table.ownerId, userId),
  });
};

export const getActiveSubscriptions = async (
  userId: number,
  subscriptions: SSubscription[]
) => {
  return subscriptions.find(
    (subscription) => subscription.ownerId === userId && !subscription.expired
  );
};

export const getFreeSubscription = async (
  userId: number,
  subscriptions?: SSubscription[]
) => {
  const _subscriptions = subscriptions || (await getSubscriptions(userId));
  return _subscriptions.find((subscription) => subscription.plan === Plan.FREE);
};

export const createSubscription = async (userId: number, plan: Plan) => {
  return await db.insert(subscriptionsTable).values({
    ownerId: userId,
    plan,
  });
};

export const setExpiredSubscription = async (id: number) => {
  return await db
    .update(subscriptionsTable)
    .set({ expired: true })
    .where(eq(subscriptionsTable.id, id));
};
