import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client";
import { Context, Plan } from "../types";
import generateKey from "../common/generateKey";
import {
  createSubscription,
  getActiveSubscriptions,
  getFreeSubscription,
  getSubscriptions,
} from "../db/queries/subscriptions";
import checkExpiredSubscription from "../common/subscriptions/checkExpiredSubscription";
import getInfoSubscribe from "../common/getInfoSubscribe";
import subscribe from "../commands/subscribe";
import { createKey } from "../db/queries/keys";

interface IParams extends Context {}

export default async (context: IParams) => {
  const { chatId, client, callbackQueryData, user } = context;

  if (!callbackQueryData?.id) return;
  const subscriptions = await getSubscriptions(user.id);
  console.log("Subscriptions for user:", chatId, subscriptions);

  const activeSubscription = await getActiveSubscriptions(
    user.id,
    subscriptions
  );

  if (activeSubscription) {
    const isExpired = await checkExpiredSubscription(activeSubscription);

    if (!isExpired) {
      const { expiredDate, plan } = getInfoSubscribe(
        activeSubscription.createdAt,
        activeSubscription.plan
      );
      await client.execute("send_message", {
        chat_id: chatId,
        parse_mode: "MarkdownV2",
        text: `У вас уже есть активная подписка на ${plan} которая истечет ${expiredDate}\\!`,
      });
      await client.execute("answer_callback_query", {
        callback_query_id: callbackQueryData.id,
      });
    } else {
      await client.execute("answer_callback_query", {
        callback_query_id: callbackQueryData.id,
        show_alert: true,
        text: "Подписка истекла",
      });
    }
  } else {
    const isHaveFreeSubscription = await getFreeSubscription(user.id);

    if (!isHaveFreeSubscription) {
      const subscribe = await createSubscription(user.id, Plan.FREE);
      console.log("new FREE subscribe", subscribe);
      const key = await createKey(user.id);

      await client.execute("send_message", {
        chat_id: chatId,
        parse_mode: "MarkdownV2",
        text: `Вы выбрали бесплатный план на 3 дня\\! 🎉
    \`${key}\` \\- ваш ключ доступа к VPN\\.
    `,
        message_effect_id: MESSAGE_EFFECTS["🎉"],
      });

      await client.execute("answer_callback_query", {
        callback_query_id: callbackQueryData.id,
      });
    } else {
      await client.execute("send_message", {
        chat_id: chatId,
        parse_mode: "MarkdownV2",
        text: `Пробный период уже истек\\!`,
      });
      await client.execute("answer_callback_query", {
        callback_query_id: callbackQueryData.id,
      });
      subscribe(context);
    }
  }
};
