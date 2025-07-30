import { $ServersSchema } from 'db/schemas/servers.schema';
import { eq } from 'drizzle-orm';
import { EncryptedSecret, IBaseProps } from 'types';

import { XuiApi } from '3x-ui';

export default async ({ context, utils }: IBaseProps, serverId: number) => {
    const { execBotMethod, db, cryptoManager, logger } = utils;
    const { chat_id } = context;
    execBotMethod('send_message', {
        chat_id,
        text: `Connecting to server with ID: ${serverId} generate key...`,
    });

    const server = await db.query.$ServersSchema.findFirst({
        where: eq($ServersSchema.id, serverId),
        with: { credentials: true },
    });

    if (!server || !server.credentials) {
        execBotMethod('send_message', {
            chat_id,
            text: 'Server not found.',
        });
        return;
    }
    let decryptedCredentials: string | undefined;

    try {
        decryptedCredentials = await cryptoManager.decryptSecret(
            server.credentials
        );
    } catch (error) {
        if (error instanceof Error) {
            logger.error(
                `Error decrypting credentials for server ${serverId}:
                ${error.message}
                `
            );
            return;
        }

        logger.error(`Error decrypting credentials for server ${serverId}:`);
    }

    if (!decryptedCredentials) {
        execBotMethod('send_message', {
            chat_id,
            text: 'Failed to decrypt server credentials.',
        });
        return;
    }

    console.log(decryptedCredentials);

    const api = new XuiApi('https://' + decryptedCredentials);
    api.debug = true; // Enables debug mode - defualt is false
    api.stdTTL = 60; // Cache time in seconds - default is 10s

    const clients = await api.getOnlineClients().catch((error) => {
        logger.error(
            `Error fetching online clients for server ${serverId}: ${error.message}`
        );
        console.log(error);
    });

    console.log(clients);

    // execBotMethod('send_message', {
    //     chat_id,
    //     text: `Decrypted credentials: ${JSON.stringify(decryptedCredentials)}`,
    // });

    // getDataExp()
};
