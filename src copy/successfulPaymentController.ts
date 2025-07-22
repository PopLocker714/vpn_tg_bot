import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client";
import { newError } from "./common/error";
import { createKey, getKeys } from "./db/queries/keys";
import { createPayment } from "./db/queries/payment";
import { createSubscription } from "./db/queries/subscriptions";
import { Context, PaymentTypeProvider } from "./types";

export default async (context: Context) => {
  if (!context.successfulPayment) {
    return;
  }

  const { client } = context;

  const {
    currency,
    provider_payment_charge_id,
    total_amount,
    invoice_payload,
  } = context.successfulPayment || {};

  const payment = await createPayment({
    ownerId: context.user.id,
    typeProvider: PaymentTypeProvider.YKASSA,
    typeSubscription: invoice_payload,
    paymentId: provider_payment_charge_id,
  });

  if (!payment) {
    newError(client, context.chatId, "Не удалось создать платеж", "10");
    return new Response("ok");
  }

  const subscribe = await createSubscription(
    context.user.id,
    invoice_payload,
    payment.id
  );

  if (!subscribe) {
    newError(client, context.chatId, "Не удалось создать подписку", "11");
    return new Response("ok");
  }

  const myKey = (await getKeys(context.user.id)).at(0);
  const key =
    myKey?.key ||
    (await (async () => {
      const key = await createKey(context.user.id);
      return key;
    })());

  await client.execute("send_message", {
    chat_id: context.chatId,
    text: `Оплата успешно прошла
      Ваш ключ доступа к VPN: \`${key}\``,
    message_effect_id: MESSAGE_EFFECTS["🎉"],
    parse_mode: "MarkdownV2",
  });
};
