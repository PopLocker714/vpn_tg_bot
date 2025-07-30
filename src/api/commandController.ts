import { ContextType } from '@/lib/context/types';
import { Commands, IBaseProps } from 'types';
import startCommand from './commands/start.command';
import subscribeCommand from './commands/subscribe.command';

export default async ({ context, utils }: IBaseProps) => {
    const { execBotMethod } = utils;
    switch (context.command) {
        case Commands.START:
            startCommand({ context, utils });
            break;
        case Commands.SUBSCRIBE:
            await subscribeCommand({ context, utils });
            break;

        default:
            if (context.type === ContextType.CALLBACK_QUERY) {
                execBotMethod('answer_callback_query', {
                    callback_query_id: context.callback_query_id,
                    text: 'Unknown command',
                    show_alert: true,
                });
                return;
            }
            execBotMethod('send_message', {
                chat_id: context.chat_id,
                text: 'Unknown command',
            });
            break;
    }

    if (context.callback_query_id) {
        execBotMethod('answer_callback_query', {
            callback_query_id: context.callback_query_id,
        });
    }

    return new Response('ok');
};
