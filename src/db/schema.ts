import * as userSchema from './schemas/user.schema';
import * as telegramDataSchema from './schemas/telegramData.schema';
import * as subscriptionsSchema from './schemas/subscription.schema';
import * as subscriptionTypeSchema from './schemas/subscriptionType.schema';
import * as paymentDataSchema from './schemas/payment.schema';
import * as serversSchema from './schemas/servers.schema';

import * as share from './schemas/share';

export const schema = {
    ...share,
    ...userSchema,
    ...telegramDataSchema,
    ...subscriptionTypeSchema,
    ...subscriptionsSchema,
    ...paymentDataSchema,
    ...serversSchema,
};
