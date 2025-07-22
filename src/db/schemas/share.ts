import { int } from "drizzle-orm/sqlite-core";

export const created_at = int()
  .$defaultFn(() => Date.now())
  .notNull();

export const updated_at = int()
  .notNull()
  .$defaultFn(() => Date.now())
  .$onUpdateFn(() => Date.now());
