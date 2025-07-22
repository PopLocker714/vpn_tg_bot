import { DB } from 'db';
import { eq } from 'drizzle-orm';
import { Utils } from 'types';

export const findByTelegramId = async (
    { db, logger }: Utils,
    telegramId: number
) => {
    return await db.query.$TelegramDataSchema
        .findFirst({
            where: (table) => eq(table.tg_id, telegramId),
            with: { owner: true },
        })
        .then((result) => result)
        .catch((err) => {
            logger.error(err);
            return undefined;
        });
};
