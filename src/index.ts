import { checkValidEnv } from '@/utils/checkValidEnv.ts';
import { Update } from '@effect-ak/tg-bot-client';
import { Hono } from 'hono';
import getContext from 'lib/context/getContext';
import getExecuteTgBotMethod from 'lib/botApi/getExecuteTgBotMethod';
import logger from './utils/logger';
import { Utils } from 'types';
import mainController from 'api/mainController';
import { db } from 'db/index';
import { AdminSecretManager } from './utils/encrypt';

checkValidEnv();

const executeTgBotMethod = getExecuteTgBotMethod();

const utils: Utils = {
    logger,
    execBotMethod: executeTgBotMethod,
    db,
    cryptoManager: new AdminSecretManager(Bun.env.ADMIN_SECRET_KEY),
};

const app = new Hono();

const text = `🔒 🟢 Bot started`;

app.get('/', (c) => {
    return c.text(text, 200, {
        'Content-Type': 'text/plain; charset=utf-8',
    });
});

app.post('/bot', async (c) => {
    const update: Update = await c.req.json();
    const context = getContext(update, utils);
    return mainController({ context, utils });
});

Bun.serve({
    fetch: app.fetch,
    port: Bun.env.PORT, // или 443 если HTTPS
    tls: {
        certFile: 'ssl/cert.pem',
        keyFile: 'ssl/privkey.pem',
    },
});

Bun.serve({
    port: 80,
    fetch(req) {
        const url = new URL(req.url);
        url.protocol = 'https:';
        return new Response(null, {
            status: 301,
            headers: {
                Location: url.toString(),
            },
        });
    },
});
