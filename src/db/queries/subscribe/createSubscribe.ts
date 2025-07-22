import { $SubscriptionsSchema, SelectSubscription } from 'db/schemas/subscription.schema';
import { IBaseProps, Utils } from 'types';

export default (
    { db, logger }: Utils,
    subscribe: Omit<SelectSubscription, 'id' | 'created_at' | 'updated_at'>
) => {
    return db
        .insert($SubscriptionsSchema)
        .values(subscribe)
        .returning()
        .then((result) => result.at(0))
        .catch((err) => {
            logger.error(err);
            console.log(err);
            return undefined;
        });
};
