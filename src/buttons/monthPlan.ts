import { Context, Plan } from "../types";
import { executeTgBotMethod, TgBotApiToken } from "@effect-ak/tg-bot-client";
import { Effect } from "effect";

interface IParams extends Context {}

export default async (context: IParams) => {
  const { chatId, client, callbackQueryData, user } = context;
  console.log("Month plan button clicked", chatId, user.id);

  //   console.log("callbackQueryData", callbackQueryData, chatId);

  executeTgBotMethod("send_invoice", {
    chat_id: chatId,
    currency: "RUB",
    description: "Подписка на месяц",
    payload: Plan.MONTH,
    start_parameter: "test",
    prices: [{ label: "Подписка на месяц", amount: 10000 }],
    title: "Подписка на месяц",
    provider_token: process.env.YKASSA_PROVIDER_TOKEN!,
  })
    .pipe(
      Effect.provideService(TgBotApiToken, Bun.env.TELEGRAM_BOT_TOKEN!),
      Effect.runPromiseExit
    )
    .then((result) => {
      console.log("✅ Invoice sent:", result);
    });

  callbackQueryData?.id &&
    (await client.execute("answer_callback_query", {
      callback_query_id: callbackQueryData.id,
    }));

  // //   try {
  // //     const result = await Effect.runPromise(
  // //       client.execute("send_invoice", {
  // //         chat_id: chatId,
  // //         currency: "RUB",
  // //         description: "Подписка на месяц",
  // //         payload: Plan.MONTH,
  // //         start_parameter: "test",
  // //         prices: [{ label: "Подписка на месяц", amount: 100 }],
  // //         title: "Подписка на месяц",
  // //         provider_token: process.env.YKASSA_PROVIDER_TOKEN!,
  // //       })
  // //     );

  //     console.log("✅ Invoice sent:", result);
  //   } catch (err) {
  //     console.error("❌ Ошибка при отправке счета:", err?.cause ?? err);
  //   }
};
