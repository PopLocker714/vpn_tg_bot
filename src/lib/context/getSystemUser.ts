import { User } from '@effect-ak/tg-bot-client';
import createTelegramData from 'db/queries/telegramData/createTelegramData';
import { findByTelegramId } from 'db/queries/telegramData/findTelegramData';
import setTelegramDataOwner from 'db/queries/telegramData/setTelegramDataOwner';
import createUser from 'db/queries/user/createUser';
import { SelectUser } from 'db/schemas/user.schema';
import { Utils } from 'types';

export default async (utils: Utils, tg_user: User, chat_id: number): Promise<SelectUser | undefined> => {
    const user = await findByTelegramId(utils, tg_user.id);

    if (!user) {
        const new_user = await createUser(utils);
        new_user &&
            createTelegramData(utils, tg_user, chat_id).then(
                (telegram_data) => {
                    telegram_data &&
                        setTelegramDataOwner(
                            utils,
                            new_user.id,
                            telegram_data.id
                        );
                }
            );

        if (!new_user) {
            return undefined;
        }

        return new_user;
    }

    return user.owner;
};
