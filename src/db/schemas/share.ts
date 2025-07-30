import { int } from 'drizzle-orm/sqlite-core';

export const created_at = int({ mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull();

export const updated_at = int({ mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())
    .notNull();
