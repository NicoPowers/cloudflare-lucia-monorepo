import 'dotenv/config';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db, client } from './db';


async function main() {
    // console.log(process.env.LIBSQL_DB_URL);
    // This will run migrations on the database, skipping the ones already applied
    await migrate(db, {
        migrationsFolder: './drizzle/migrations',
    });


    // Don't forget to close the connection, otherwise the script will hang
    client.close();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});