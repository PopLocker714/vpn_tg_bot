import { MESSAGE_EFFECTS } from "@effect-ak/tg-bot-client";
import { Commands, Context, Plan } from "../types";

interface IParams extends Context {}

export const startFast = async (
  userName: string,
  chat_id: number,
  client: Context["client"]
) => {
  await client.execute("send_message", {
    chat_id,
    parse_mode: "MarkdownV2",
    text: `
Привет *${userName}\\!*

💻 Добро пожаловать в *CatFlyVPN\\!*

Мы предоставляем доступ к VPN для обхода блокировок и обеспечения безопасности в интернете\\. Пользуясь нашим VPN, Вы получите доступ к Instagram, YouTube, TikTok, Facebook, Twitter и другим заблокированным сервисам\\.
`,
    message_effect_id: MESSAGE_EFFECTS["💩"],
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "👉 Подключиться к VPN",
            callback_data: Commands.SUBSCRIBE,
          },
        ],
        [
          {
            text: "🔑 Мои ключи",
            callback_data: Commands.KEYS,
          },
        ],
        [
          {
            text: "🤩 Пробный период: 3 дня ",
            callback_data: Plan.FREE,
          },
        ],
      ],
    },
  });
};

export default async ({ client, tgUser: user, chatId }: IParams) => {
  startFast(user.first_name, chatId, client);
};
