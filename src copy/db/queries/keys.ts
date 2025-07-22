import { randomUUIDv7 } from "bun";
import { db } from "..";
import { keysTable } from "../schema";
import { eq } from "drizzle-orm";

export const createKey = async (userId: number) => {
  const key = randomUUIDv7();
  await db.insert(keysTable).values({
    key,
    ownerId: userId,
  });

  console.log("Key created:", key);

  return key;
};

export const getKeys = async (userId: number) => {
  return await db.query.keysTable.findMany({
    where: (table) => eq(table.ownerId, userId),
  });
};
