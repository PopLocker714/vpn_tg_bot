import { InlineKeyboardButton } from "@effect-ak/tg-bot-client";
import { getKeys } from "../db/queries/keys";
import {
  getActiveSubscriptions,
  getSubscriptions,
} from "../db/queries/subscriptions";
import { Commands, Context } from "../types";

const buttons: InlineKeyboardButton[][] = [
  [
    {
      text: "🔙 Назад",
      callback_data: Commands.MENU,
    },
  ],
];

export default async ({ client, user, chatId, callbackQueryData }: Context) => {
  const keys = await getKeys(user.id);
  const subscription = await getSubscriptions(user.id);
  const activeSub = await getActiveSubscriptions(user.id, subscription);

  if (keys.length === 0) {
    client.execute("send_message", {
      chat_id: chatId,
      parse_mode: "MarkdownV2",
      text: "У вас нет ключей",
      reply_markup: {
        inline_keyboard: buttons,
      },
    });

    callbackQueryData?.id &&
      client.execute("answer_callback_query", {
        callback_query_id: callbackQueryData.id,
      });
    return;
  }

  if (activeSub === undefined || activeSub.expired) {
    await client.execute("send_message", {
      chat_id: chatId,
      parse_mode: "MarkdownV2",
      text: "Ваша подписка истекла",
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
    callbackQueryData?.id &&
      client.execute("answer_callback_query", {
        callback_query_id: callbackQueryData.id,
      });

    return;
  }

  await client.execute("send_message", {
    chat_id: chatId,
    parse_mode: "MarkdownV2",
    text: `\` ${keys.at(0)?.key}\``,
  });
  callbackQueryData?.id &&
    client.execute("answer_callback_query", {
      callback_query_id: callbackQueryData.id,
    });
};
