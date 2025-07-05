import { Hono } from "hono";
import {
  makeTgBotClient,
  MESSAGE_EFFECTS,
  Update,
} from "@effect-ak/tg-bot-client";
import getContext from "./common/getContext";
import commandController from "./commandController";
import callbackDataController from "./callbackDataController";
import { startFast } from "./commands/start";
import { Commands, PaymentTypeProvider } from "./types";
import { createSubscription } from "./db/queries/subscriptions";
import { createPayment } from "./db/queries/payment";
import { newError } from "./common/error";
import { createKey, getKeys } from "./db/queries/keys";
import generateKey from "./common/generateKey";
import preCheckoutQueryController from "./preCheckoutQueryController";
import successfulPaymentController from "./successfulPaymentController";

const app = new Hono();

if (process.env.TELEGRAM_BOT_TOKEN === undefined) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const client = makeTgBotClient({
  bot_token: process.env.TELEGRAM_BOT_TOKEN,
});

app.get("/", (c) => {
  return c.text("🔒 Hello from poploker.ru with HTTPS (self-signed)!");
});

app.post("*", async (c) => {
  const body: Update = await c.req.json();
  const text = body.message?.text || "";
  console.log("body", body);

  if (
    text === Commands.START &&
    body.message?.chat.id &&
    body?.message?.from?.first_name
  ) {
    startFast(body.message.from.first_name, body.message.chat.id, client);
    return new Response("ok");
  }

  const context = await getContext(body, client);

  if (context.error) {
    await client.execute("send_message", {
      chat_id: context.chatId,
      text: context.error,
    });
  }

  if (context.commandData) {
    await commandController(context);
  }

  if (context.callbackQueryData) {
    await callbackDataController(context);
  }

  if (context.preCheckoutQueryData) {
    await preCheckoutQueryController(context);
  }

  if (context.successfulPayment) {
    await successfulPaymentController(context);
  }

  return new Response("ok");
});

Bun.serve({
  fetch: app.fetch,
  port: Bun.env.PORT, // или 443 если HTTPS
  tls: {
    certFile: "ssl/cert.pem",
    keyFile: "ssl/privkey.pem",
  },
});

Bun.serve({
  port: 80,
  fetch(req) {
    const url = new URL(req.url);
    url.protocol = "https:";
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
      },
    });
  },
});
