import { Utils } from 'types';

export default async ({ db, logger }: Utils) => {
    return await db.query.$ServersSchema.findMany().catch((err) => {
        console.log('Error fetching available servers:', err);
        logger.error('Error fetching available servers:', err);
        return undefined;
    });
};
