import { $PaymentDataSchema, InsertPayment } from 'db/schemas/payment.schema';
import { Utils } from 'types';

export default async (
    { db, logger }: Utils,
    paymentData: Omit<InsertPayment, 'id' | 'created_at'>
) => {
    return await db
        .insert($PaymentDataSchema)
        .values(paymentData)
        .returning()
        .then((result) => result.at(0))
        .catch((err) => {
            logger.error(err);
            console.log(err);
            return undefined;
        });
};
