import { Update } from '@effect-ak/tg-bot-client';
import getContextRoomId from './getContextRoomId';
import getContextType from './getContextType';
import {
    Context,
    ContextType,
    CtxCallbackQuery,
    CtxMessage,
    CtxUnknown,
} from './types';
import getUserFromUpdate from './getUserFromUpdate';
import getCommandFromUpdate from './getCommandFromUpdate';
import getSystemUser from './getSystemUser';
import { Utils } from 'types';

export default (update: Update, utils: Utils): Context => {
    const chat_id = getContextRoomId(update);
    const type = getContextType(update);
    const user = getUserFromUpdate(update);
    const _user = user && getSystemUser(utils, user, chat_id);
    const command = getCommandFromUpdate(update);
    const callback_query_id = update.callback_query?.id;
    const callback_data = update.callback_query?.data;

    switch (type) {
        case ContextType.UNKNOWN:
            return { chat_id, type, user, command, _user } as CtxUnknown;
        case ContextType.MESSAGE:
            return { chat_id, type, user, command, _user } as CtxMessage;
        case ContextType.CALLBACK_QUERY:
            return {
                chat_id,
                type,
                user,
                _user,
                command,
                callback_query_id,
                callback_data,
            } as CtxCallbackQuery;
        default:
            throw new Error(`Unsupported context type: ${type}`);
    }
};
