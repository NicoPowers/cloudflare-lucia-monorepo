import 'dotenv/config';
import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql';
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from './schema';

export const client = createClient({ url: process.env.LIBSQL_DB_URL!, authToken: process.env.LIBSQL_DB_AUTH_TOKEN });;
export const db = drizzle(client);
export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

