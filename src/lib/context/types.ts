import { User } from '@effect-ak/tg-bot-client';
import { SelectRelUser } from 'db/schemas/user.schema';
import { Plan, Commands } from 'types';

export enum ContextType {
    MESSAGE = 'message',
    CALLBACK_QUERY = 'callback_query',
    UNKNOWN = 'unknown',
}

interface Ctx {
    chat_id: number;
    user?: User;
    _user?: Promise<SelectRelUser>;
    command?: Commands;
    callback_query_id?: string;
    callback_data?: Plan;
}

export interface CtxMessage extends Ctx {
    type: ContextType.MESSAGE;
}

export interface CtxCallbackQuery extends Ctx {
    type: ContextType.CALLBACK_QUERY;
    callback_query_id: string;
    callback_data: Plan | string;
}

export interface CtxUnknown extends Ctx {
    type: ContextType.UNKNOWN;
}

export type Context = CtxMessage | CtxCallbackQuery | CtxUnknown;
