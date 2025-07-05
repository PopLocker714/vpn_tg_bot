import { makeTgBotClient } from "@effect-ak/tg-bot-client";

if (process.env.TELEGRAM_BOT_TOKEN === undefined) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

if (process.env.TELEGRAM_WEBHOOK_URL === undefined) {
  throw new Error("TELEGRAM_WEBHOOK_URL is not defined");
}

const client = makeTgBotClient({
  bot_token: process.env.TELEGRAM_BOT_TOKEN,
});
client
  .execute("set_webhook", {
    url: process.env.TELEGRAM_WEBHOOK_URL,
    allowed_updates: ["message", "callback_query", "pre_checkout_query"],
  })
  .then(() => {
    console.log("Webhook set successfully");
  })
  .catch((error) => {
    console.error("Error setting webhook:", error);
  });

export default client;
