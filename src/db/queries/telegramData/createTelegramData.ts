import { User } from '@effect-ak/tg-bot-client';
import { $TelegramDataSchema } from 'db/schemas/telegramData.schema';
import { Utils } from 'types';

export default ({ db, logger }: Utils, user: User, chatId: number) => {
    return db
        .insert($TelegramDataSchema)
        .values({
            chat_id: chatId,
            tg_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username || 'unknown',
            owner_id: user.id,
        })
        .returning()
        .then((result) => result.at(0))
        .catch((err) => {
            logger.error(err);
            return undefined;
        });
};
