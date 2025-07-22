import { Update } from '@effect-ak/tg-bot-client';

export default (update: Update) => {
    if (update?.message?.from) {
        return update.message.from;
    }

    if (update?.callback_query?.from) {
        return update.callback_query.from;
    }

    return undefined;
};
