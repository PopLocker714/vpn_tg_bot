import { CtxCallbackQuery } from '@/lib/context/types';
import { Utils } from 'types';
import commandController from './commandController';
import callBackQueryDataController from './callBackQueryDataController';

export default (context: CtxCallbackQuery, utils: Utils) => {
    if (context.command) {
        return commandController({ context, utils });
    }

    return callBackQueryDataController(context, utils);
};
