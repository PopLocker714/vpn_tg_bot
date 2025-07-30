import { Api } from '@effect-ak/tg-bot-client';
import { TLogger } from './utils/logger';
import { ExitResultError, ExitResultSuccess } from './lib/botApi/types';
import { DB, DB_TX } from 'db';
import { Context } from './lib/context/types';
import { TCryptoManager } from './utils/encrypt';

export interface Utils {
    logger: TLogger;
    execBotMethod: <M extends keyof Api>(
        method: M,
        input: Parameters<Api[M]>[0]
    ) => Promise<ExitResultError | ExitResultSuccess<M>>;
    db: DB | DB_TX;
    cryptoManager: TCryptoManager;
}

export interface IBaseProps {
    context: Context;
    utils: Utils;
}

export enum Commands {
    START = '/start',
    SUBSCRIBE = '/subscribe',
}

export enum Plan {
    FREE = 'free',
    SUBSCRIBE_1 = 'month',
    SUBSCRIBE_2 = '3month',
    SUBSCRIBE_3 = 'year',
}

export enum Protocol {
    VLESS = 'vless',
    SHADOWSOCKS = 'shadowsocks',
}

export const FREE_TIME = 66000;
export const MONTH = 30 * 24 * 60 * 60 * 1000;
export const THREE_MONTH = 90 * 24 * 60 * 60 * 1000;
export const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

export interface EncryptedSecret {
    encryptedData: string;
    iv: string;
    authTag: string;
    salt: string;
    iterations: number;
    hashAlgorithm: string;
}
