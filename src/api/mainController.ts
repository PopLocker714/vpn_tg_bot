import { ContextType } from '@/lib/context/types';
import { IBaseProps } from 'types';
import callbackQueryController from './callbackQueryController';
import messageController from './messageController';

export default async ({ context, utils }: IBaseProps) => {
    switch (context.type) {
        case ContextType.MESSAGE:
            return messageController(context, utils);
        case ContextType.CALLBACK_QUERY:
            return callbackQueryController(context, utils);
        default:
            return new Response('ok');
    }
};
