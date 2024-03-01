// auth.ts
import { Lucia } from "lucia";
import { adapter } from "@drizzle/db";

// regular expression that adheres closely to the specifications for valid email addresses as defined by the Internet Engineering Task Force (IETF) in RFC 5322
export function isValidEmail(email: string): boolean {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}


export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.env === "PRODUCTION" // set `Secure` flag in HTTPS
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// we don't need to expose the hashed password!
			email: attributes.email
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			email: string;
		};
	}
}