import { $UsersSchema } from "db/schemas/user.schema";
import { eq } from "drizzle-orm";
import { Utils } from "types";

export default async ({ db, logger }: Utils, id: number) => {
    return await db
        .delete($UsersSchema)
        .where(eq($UsersSchema.id, id))
        .returning()
        .then((result) => result.at(0))
        .catch((err) => {
            logger.error(err);
            return undefined;
        });
};
