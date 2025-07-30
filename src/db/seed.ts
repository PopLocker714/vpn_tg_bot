import { AdminSecretManager } from '@/utils/encrypt';
import { db } from '.';
import { $AdminSecretSchema } from './schemas/secrets.schema';
import { $ServersSchema } from './schemas/servers.schema';
import { $SubscriptionTypeSchema } from './schemas/subscriptionType.schema';
import { Plan, Protocol } from 'types';

const adminSecretManager = new AdminSecretManager(Bun.env.ADMIN_SECRET_KEY!);

const seed = async () => {
    await db
        .insert($SubscriptionTypeSchema)
        .values([
            {
                type: Plan.FREE,
            },
            {
                type: Plan.SUBSCRIBE_1,
            },
            {
                type: Plan.SUBSCRIBE_2,
            },
            {
                type: Plan.SUBSCRIBE_3,
            },
        ])
        .catch((error) => {
            console.log(error.message);
        });

    const netherlands =
        'dm2IV4IZ2z:PLc3M18Jtb@206.166.251.108:54637/Y1AwMnUgrswTN3A';

    const res = await adminSecretManager.encryptSecret(netherlands);
    console.log(res);
    console.log(await adminSecretManager.decryptSecret(res));

    const adminSecrets = await db
        .insert($AdminSecretSchema)
        .values([{ ...res, description: 'Netherlands server secret' }])
        .returning();

    await db.insert($ServersSchema).values([
        {
            name: '🇳🇱 Netherlands',
            max_keys: 50,
            protocols: [Protocol.VLESS],
            credentials: adminSecrets[0].id,
        },
    ]);

    Bun.color('green', 'ansi-256');
    console.log('Seed Done!');
};

seed();
