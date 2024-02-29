import 'dotenv/config';
import { createClient } from "@libsql/client/web";
import { drizzle } from 'drizzle-orm/libsql';


export const client = createClient({ url: process.env.LIBSQL_DB_URL!, authToken: process.env.LIBSQL_DB_AUTH_TOKEN });;
export const db = drizzle(client);

