import {
  getActiveSubscriptions,
  getSubscriptions,
} from "./db/queries/subscriptions";
import { Context } from "./types";

export default async (context: Context) => {
  console.log("Pre-checkout query received:", context.preCheckoutQueryData);

  const id = context.preCheckoutQueryData?.id;

  if (!id) {
    return;
  }

  const { client } = context;

  const subscriptions = await getSubscriptions(context.user.id);
  const activeSub = await getActiveSubscriptions(
    context.user.id,
    subscriptions
  );

  console.log("Active subscription for user:", context.chatId, activeSub);

  if (activeSub) {
    await client.execute("answer_pre_checkout_query", {
      pre_checkout_query_id: id,
      ok: false,
      error_message: "У вас уже есть активная подписка!",
    });
  } else {
    await client.execute("answer_pre_checkout_query", {
      pre_checkout_query_id: id,
      ok: true,
    });
  }
};
