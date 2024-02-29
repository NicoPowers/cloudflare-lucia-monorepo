import { Client as LibsqlClient, createClient } from "@libsql/client/web";
import { Router, RouterType } from "itty-router";
import { countries } from "@drizzle/schema";
import { drizzle } from 'drizzle-orm/libsql';
import { getRandomCountryName } from "@lib/utils";

export interface Env {
    // The environment variable containing your the URL for your Turso database.
    LIBSQL_DB_URL?: string;
    // The Secret that contains the authentication token for your Turso database.
    LIBSQL_DB_AUTH_TOKEN?: string;

    // These objects are created before first use, then stashed here
    // for future use
    router?: RouterType;
}

export default {
    async fetch(request, env): Promise<Response> {
        if (env.router === undefined) {
            env.router = buildRouter(env);
        }

        return env.router.handle(request);
    },
} satisfies ExportedHandler<Env>;

function buildLibsqlClient(env: Env): LibsqlClient {
    const url = env.LIBSQL_DB_URL?.trim();
    if (url === undefined) {
        throw new Error("LIBSQL_DB_URL env var is not defined");
    }

    const authToken = env.LIBSQL_DB_AUTH_TOKEN?.trim();
    if (authToken === undefined) {
        throw new Error("LIBSQL_DB_AUTH_TOKEN env var is not defined");
    }

    return createClient({ url, authToken });
}

function buildRouter(env: Env): RouterType {
    const router = Router();

	const client = buildLibsqlClient(env);
	const db = drizzle(client);

    router.get("/countries", async () => {
        const rs = await db.select().from(countries).execute();
        return Response.json(rs);
    });

    router.get("/add-country", async (request) => {
        const country = getRandomCountryName();
		
        try {
            await db.insert(countries).values({name: country}).execute();
        } catch (e) {
            console.error(e);
            return new Response("database insert failed");
        }

        return new Response("Added");
    });

    router.all("*", () => new Response("Not Found.", { status: 404 }));

    return router;
}
