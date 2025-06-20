import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index.js";
import drizzleConfig from "../../drizzle.config.js";

export async function runMigrations() {
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
