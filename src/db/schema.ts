import * as userSchema from './schemas/user.schema';
import * as telegramDataSchema from './schemas/telegramData.schema';
import * as subscriptionsSchema from './schemas/subscription.schema';
import * as subscriptionTypeSchema from './schemas/subscriptionType.schema';
import * as paymentDataSchema from './schemas/payment.schema';
import * as serversSchema from './schemas/servers.schema';
import * as adminSecrets from './schemas/secrets.schema';

import * as share from './schemas/share';

export const schema = {
    ...share,
    ...adminSecrets,
    ...userSchema,
    ...telegramDataSchema,
    ...subscriptionTypeSchema,
    ...subscriptionsSchema,
    ...paymentDataSchema,
    ...serversSchema,
};
