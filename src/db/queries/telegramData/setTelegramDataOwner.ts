import { $TelegramDataSchema } from 'db/schemas/telegramData.schema';
import { eq } from 'drizzle-orm';
import { Utils } from 'types';

export default async (
    { db, logger }: Utils,
    owner_id: number,
    telegramDataId: number
) => {
    return await db
        .update($TelegramDataSchema)
        .set({ owner_id })
        .where(eq($TelegramDataSchema.id, telegramDataId))
        .returning()
        .then((result) => result.at(0))
        .catch((err) => {
            logger.error(err);
            return undefined;
        });
};
