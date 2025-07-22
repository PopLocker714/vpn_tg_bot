import { $PaymentDataSchema } from 'db/schemas/payment.schema';
import { SelectRelUser } from 'db/schemas/user.schema';
import { and, eq } from 'drizzle-orm';
import { Utils } from 'types';

export default async (
    { db, logger }: Utils,
    provider: string,
    user: SelectRelUser
) => {
    return await db.query.$PaymentDataSchema
        .findFirst({
            where: and(
                eq($PaymentDataSchema.provider, provider),
                eq($PaymentDataSchema.owner_id, user.id)
            ),
        })
        .catch((err) => {
            logger.error(err);
            console.log(err);
            return undefined;
        });
};
