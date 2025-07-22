import * as schema from "./schema";
import { drizzle } from "drizzle-orm/bun-sqlite";

export const db = drizzle({
  connection: { source: process.env.DB_FILE_NAME! },
  schema,
});
