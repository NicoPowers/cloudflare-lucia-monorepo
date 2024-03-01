import { Client as LibsqlClient, createClient } from "@libsql/client/web";
import { IRequest, Router, RouterType } from "itty-router";
import { countries, userTable } from "@drizzle/schema";
import { drizzle } from 'drizzle-orm/libsql';
import { getRandomCountryName } from "@lib/utils";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password"
import { isValidEmail, lucia } from "@lib/auth";

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


    router.post("/sign-up", async (request) => {
        const formData = request.formData() as FormData;
        const email = formData.get("email");
        // check if email is valid
        if (!email || typeof email !== "string" || !isValidEmail(email)) {
            return new Response("Invalid email", {
                status: 400
            });
        }
        // check if password is valid
        const password = formData.get("password");
        if (!password || typeof password !== "string" || password.length < 6) {
            return new Response("Invalid password", {
                status: 400
            });
        }
    
        // hash the password
        const hashedPassword = await new Argon2id().hash(password);
        const userId = generateId(15);

        try {
            await db.insert(userTable).values({
                id: userId,
                email,
                hashed_password: hashedPassword
            });
    
            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/",
                    "Set-Cookie": sessionCookie.serialize()
                }
            });
        } catch {
            // db error, email taken, etc
            return new Response("Email already used", {
                status: 400
            });
        }
    
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
