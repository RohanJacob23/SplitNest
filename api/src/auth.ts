import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000"],
  advanced: { cookiePrefix: "splitNest-auth" },
  session: { cookieCache: { enabled: true, maxAge: 7 * 24 * 60 * 60 } },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 3,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
});
