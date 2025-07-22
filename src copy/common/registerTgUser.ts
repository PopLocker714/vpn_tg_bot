import { eq } from "drizzle-orm";
import { db } from "../db";
import { telegramDataTable } from "../db/schema";
import { createUser } from "../db/queries/user";
import { createTelegramData } from "../db/queries/telegramData";
import { User } from "@effect-ak/tg-bot-client";

export default async (user: User) => {
  const existingTgUser = await db.query.telegramDataTable.findFirst({
    where: eq(telegramDataTable.id, user.id),
    with: {
      user: true,
    },
  });

  if (!existingTgUser) {
    const systemUser = await createUser();

    if (!systemUser) {
      throw new Error("System user not found");
    }

    const newUser = await createTelegramData(user, systemUser.id);

    return { tgUser: newUser, user: systemUser };
  } else {
    const returnData = {
      user: existingTgUser.user,
      tgUser: (() => {
        const { user: _user, ...tgUserWithoutUser } = existingTgUser;
        return tgUserWithoutUser;
      })(),
    };

    return returnData;
  }
};
