import { User } from "@effect-ak/tg-bot-client";
import { db } from "..";
import { telegramDataTable } from "../schema";

export const createTelegramData = async (user: User, ownerId: number) => {
  return (
    await db
      .insert(telegramDataTable)
      .values({
        id: user.id,
        chatId: ownerId,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username || "empty",
        ownerId,
      })
      .returning()
  ).at(0);
};
