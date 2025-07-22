import { CtxMessage } from '@/lib/context/types';
import commandController from 'api/commandController';
import { Utils } from 'types';
export default async (context: CtxMessage, utils: Utils) => {
    if (context.command) {
        return commandController({ context, utils });
    }

    return new Response('ok');
};
