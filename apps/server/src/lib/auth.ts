import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import * as schema from "../db/schema";

export const auth = betterAuth({
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	advanced: {
		cookiePrefix: "splitNest-auth",
		cookies: {
			session_token: { attributes: { sameSite: "none" } },
			session_data: { attributes: { sameSite: "none" } },
		},
		useSecureCookies:true
	},
	session: { cookieCache: { enabled: true, maxAge: 7 * 24 * 60 * 60 } },
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 3,
	},
	database: drizzleAdapter(db, {
		provider: "pg", // or "mysql", "sqlite"
		schema,
	}),
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
});

export type Auth = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
