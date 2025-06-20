import { Hono } from "hono";
import { makeTgBotClient, Update } from "@effect-ak/tg-bot-client";
import getContext from "./common/getContext";
import commandController from "./commandController";
import callbackDataController from "./callbackDataController";
import { startFast } from "./commands/start";
import { Commands } from "./types";

const app = new Hono();

if (process.env.TELEGRAM_BOT_TOKEN === undefined) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const client = makeTgBotClient({
  bot_token: process.env.TELEGRAM_BOT_TOKEN,
});

app.get("/", (c) => {
  return c.text("Hello, this is CatFlyVPN bot!");
});

app.post("*", async (c) => {
  const body: Update = await c.req.json();
  const text = body.message?.text || "";

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

  return new Response("ok");
});

Bun.serve({
  fetch: app.fetch,
  port: Bun.env.PORT, // или 443 если HTTPS
});
