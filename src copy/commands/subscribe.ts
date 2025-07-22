import { eq } from "drizzle-orm";
import { db } from "../db";
import { Commands, Context, Plan } from "../types";
import { InlineKeyboardButton } from "@effect-ak/tg-bot-client";
import checkActiveSubscriptions from "../common/subscriptions/checkActiveSubscriptions";
import getInfoSubscribe from "../common/getInfoSubscribe";
import checkExpiredSubscription from "../common/subscriptions/checkExpiredSubscription";

interface IParams extends Context {}

const plansButtons: InlineKeyboardButton[][] = [
  [
    {
      text: "🤩 3 дня 0₽",
      callback_data: Plan.FREE,
    },
  ],
  [
    {
      text: "💰 1 месяц 100₽",
      callback_data: Plan.MONTH,
    },
  ],
  [
    {
      text: "💰 3 месяца 250₽",
      callback_data: Plan.THREE_MONTH,
    },
  ],
  [
    {
      text: "💰 1 год 500₽",
      callback_data: Plan.YEAR,
    },
  ],
  [
    {
      text: "🔙 Назад",
      callback_data: Commands.MENU,
    },
  ],
];

export default async ({ client, chatId, user }: IParams) => {
  const subscriptions = await db.query.subscriptionsTable.findMany({
    where: (table) => eq(table.ownerId, user.id),
  });

  const activeSubscription = checkActiveSubscriptions(subscriptions);

  if (activeSubscription) {
    const isExpired = await checkExpiredSubscription(activeSubscription);

    if (!isExpired) {
      await client.execute("send_message", {
        chat_id: chatId,
        parse_mode: "MarkdownV2",
        text: `Вы уже подписаны на план ${activeSubscription.plan}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "☰ Меню",
                callback_data: Commands.MENU,
              },
            ],
          ],
        },
      });
    }

    //     if (activeSubscription.plan === Plan.FREE) {
    //       const expiredDateNumber =
    //         activeSubscription.createdAt + 1000 * 60 * 60 * 24 * 3;
    //       const isExpired = expiredDateNumber > Date.now();

    //       const { expiredDate, plan } = getInfoSubscribe(
    //         activeSubscription.createdAt,
    //         activeSubscription.plan
    //       );

    //       if (isExpired) {
    //         await client.execute("send_message", {
    //           chat_id: chatId,
    //           parse_mode: "MarkdownV2",
    //           text: `Пробный период был окончен ${expiredDate}\\.
    // Вы можете выбрать другой план\\.`,
    //           reply_markup: {
    //             inline_keyboard: plansButtons,
    //           },
    //         });
    //       }
    // }
  } else {
    await client.execute("send_message", {
      chat_id: chatId,
      parse_mode: "MarkdownV2",
      text: `У вас нет активных подписок\\! Пожалуйста, выберите комфортный для вас план\\.`,
      reply_markup: {
        inline_keyboard: plansButtons,
      },
    });
  }
};
