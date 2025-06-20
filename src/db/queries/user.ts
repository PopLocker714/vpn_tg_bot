import { eq } from "drizzle-orm";
import { db } from "..";
import { usersTable } from "../schema";
import { User } from "@effect-ak/tg-bot-client";

export const createUser = async () => {
  return (await db.insert(usersTable).values({}).returning()).at(0);
};

export const getUserByTgId = async (tgUser: User) => {
  const user = await db.query.telegramDataTable.findFirst({
    where: (table) => eq(table.id, tgUser.id),
    with: {
      user: true,
    },
  });

  return user?.user;
};
