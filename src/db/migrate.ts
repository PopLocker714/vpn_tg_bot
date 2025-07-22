import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index.js";
import drizzleConfig from "../../drizzle.config.js";
import { checkValidEnv } from "@/utils/checkValidEnv.js";

export async function runMigrations() {
    checkValidEnv()
    try {
        if (!drizzleConfig.out) {
            throw new Error(
                "Migrations folder is not specified in drizzle.config.js"
            );
        }

        migrate(db, {
            migrationsFolder: drizzleConfig.out,
        });
        console.log("Migrations completed successfully.");
    } catch (error) {
        console.error("Error running migrations:", error);
    }
}

runMigrations();

export default runMigrations;
