import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'turso', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: process.env.LIBSQL_DB_URL ? process.env.LIBSQL_DB_URL : '',
    authToken: process.env.LIBSQL_DB_AUTH_TOKEN,
  },
} satisfies Config;