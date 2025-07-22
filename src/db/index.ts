import { drizzle } from 'drizzle-orm/bun-sqlite';
import { schema } from './schema';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export const db = drizzle({
    connection: { source: process.env.DB_FILE_NAME! },
    schema: schema,
});

export type DB = typeof db;

export type DB_TX = SQLiteTransaction<
    'sync',
    void,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
>;
