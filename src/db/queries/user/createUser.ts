import { $UsersSchema } from 'db/schemas/user.schema';
import { Utils } from 'types';

export default async ({ db, logger }: Utils) => {
    return await db
        .insert($UsersSchema)
        .values({})
        .returning()
        .then((result) => result.at(0))
        .catch((err) => {
            logger.error(err);
            return undefined;
        });
};
