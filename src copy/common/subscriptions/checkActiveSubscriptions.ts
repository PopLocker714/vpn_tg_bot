import { db } from "../../db";

export default (
  subscriptions: Awaited<
    ReturnType<typeof db.query.subscriptionsTable.findMany>
  >
) => {
  return subscriptions.find((subscription) => subscription.expired === false);
};
