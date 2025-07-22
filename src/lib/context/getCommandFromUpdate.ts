import { Update } from '@effect-ak/tg-bot-client';
import { Commands } from 'types';

const isBotCommand = (update: Update) => {
    if (update.message?.entities) {
        return update.message.entities.map((entity) => {
            if (entity.type === 'bot_command') {
                return entity;
            }
        });
    }
    return [];
};

const checkCommandExistence = (text: string) => {
    const commands = Object.values(Commands);

    for (let i = 0; i < commands.length; i++) {
        const element = commands[i];

        if (element === text) {
            return element;
        }
    }
};

export default (update: Update) => {
    const botCommand = isBotCommand(update);
    if (update.message?.entities && update.message.text) {
        if (isBotCommand.length > 0) {
            const entity = botCommand.at(0);
            if (!entity) return checkCommandExistence(update.message.text);
            return checkCommandExistence(
                update.message.text.substring(
                    entity.offset,
                    entity.offset + entity.length
                )
            );
        }
    }

    if (update.callback_query?.data) {
        return checkCommandExistence(update.callback_query.data);
    }

    return undefined;
};
