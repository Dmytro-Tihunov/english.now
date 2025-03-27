import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createClient } from "@repo/db";
import { schema } from "@repo/db";
import { Env } from "../types";

export const auth = (options: Env) => {
  return betterAuth({
    secret: options.BETTER_AUTH_SECRET,
    database: drizzleAdapter(createClient(options.POSTGRES_URL), {
      provider: "pg",
      schema: schema,
    }),
    trustedOrigins: ["*"],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      apple: {
        clientId: options.APPLE_CLIENT_ID,
        clientSecret: options.APPLE_SECRET,
        // appBundleIdentifier: 'com.english.now',
      },
      google: {
        clientId: options.GOOGLE_CLIENT_ID,
        clientSecret: options.GOOGLE_SECRET,
      },
    },
  });
};

export type Auth = ReturnType<typeof auth>;
export type User = Auth["$Infer"]["Session"]["user"];
export type Session = Auth["$Infer"]["Session"]["session"];
