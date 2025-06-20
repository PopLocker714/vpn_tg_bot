import { makeTgBotClient, Update } from "@effect-ak/tg-bot-client";
import { Context } from "../types";
import registerTgUser from "./registerTgUser";
import { getUser, getUserByTgId } from "../db/queries/user";

const userEmptyData = {
  user: { createdAt: 0, id: 0 },
  tgUser: {
    id: 0,
    first_name: "",
    is_bot: false,
  },
  chatId: 0,
};

export default async (
  body: Update,
  client: ReturnType<typeof makeTgBotClient>
): Promise<Context> => {
  if (body.message) {
    const chatId = body.message.chat.id;
    const command = body.message.text?.trim();
    const tgUser = body.message.from;

    if (!tgUser) {
      return {
        ...userEmptyData,
        client,
        chatId,
        error: "Пользователь не найден",
      };
    }

    const { user } = await registerTgUser(tgUser);

    // const user = existingUser.user || (await getUserByTgId(tgUser));

    if (!command) {
      return {
        tgUser,
        user,
        client,
        chatId,
      };
    }

    return {
      client,
      chatId,
      tgUser,
      user,
      commandData: {
        text: command,
      },
    };
  }

  if (body.callback_query) {
    const data = body.callback_query.data;
    const chatId = body.callback_query.from.id;
    const callback_query_id = body.callback_query.id;
    const tgUser = body.callback_query.from;
    const user = await getUserByTgId(tgUser).then(async (user) => {
      if (!user) {
        return (await registerTgUser(tgUser)).user;
      }
      return user;
    });

    if (data) {
      return {
        client,
        chatId,
        tgUser,
        user,
        callbackQueryData: {
          text: data,
          id: callback_query_id,
        },
      };
    }
  }

  return {
    client,
    ...userEmptyData,
    error: "Произошла непредвиденная ошибка",
  };
};
