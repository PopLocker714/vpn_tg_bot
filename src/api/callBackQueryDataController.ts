import { CtxCallbackQuery } from '@/lib/context/types';
import { Plan, Utils } from 'types';
import freeSubscribe from './subscribes/free.subscribe';
import serverDataController from './serverDataController';

export default async (context: CtxCallbackQuery, utils: Utils) => {
    const { chat_id, callback_query_id, callback_data } = context;
    const { execBotMethod } = utils;

    switch (callback_data) {
        case Plan.FREE:
            freeSubscribe({ context, utils });
            break;
        case Plan.SUBSCRIBE_1:
            execBotMethod('send_message', {
                chat_id,
                text: Plan.SUBSCRIBE_1,
            });
            break;
        case Plan.SUBSCRIBE_2:
            execBotMethod('send_message', {
                chat_id,
                text: Plan.SUBSCRIBE_2,
            });
            break;
        case Plan.SUBSCRIBE_3:
            execBotMethod('send_message', {
                chat_id,
                text: Plan.SUBSCRIBE_3,
            });
            break;

        default:
            if (callback_data.startsWith('connect_')) {
                const serverId = callback_data.split('_')[1];

                serverDataController({ context, utils }, parseInt(serverId));

                break;
            }

            console.log('Unknown callback_data', callback_data);
            break;
    }

    execBotMethod('answer_callback_query', {
        callback_query_id,
    });

    return new Response('ok');
};
