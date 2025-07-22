import { db } from '.';
import { $ServersSchema } from './schemas/servers.schema';
import { $SubscriptionTypeSchema } from './schemas/subscriptionType.schema';
import { Plan, Protocol } from 'types';

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

    await db.insert($ServersSchema).values([
        {
            ip: '206.166.251.108',
            name: '🇳🇱 Netherlands',
            max_keys: 50,
            protocols: [Protocol.VLESS],
        },
    ]);

    Bun.color('green', 'ansi-256');
    console.log('Seed Done!');
};

seed();
