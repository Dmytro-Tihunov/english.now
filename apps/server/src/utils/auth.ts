import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createClient } from "@repo/db";
import { schema } from "@repo/db";
import { Env } from "../env";

export const auth = (options: Env) => {
  return betterAuth({
    secret: options.BETTER_AUTH_SECRET,
    database: drizzleAdapter(createClient(options.POSTGRES_URL), {
      provider: "pg",
      schema: schema,
    }),
    trustedOrigins: [
      "http://localhost:8081",
      "exp://192.168.1.X:8081",
      "*",
      "exp://192.168.31.X:8081",
    ],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      apple: {
        clientId: "host.exp.Exponent",
        clientSecret:
          "eyJhbGciOiJFUzI1NiIsImtpZCI6IjU1Nlg1TUxSNVMifQ.eyJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiaXNzIjoiNkdaRjlMVlU3MiIsImlhdCI6MTc0MDE2NzA4NiwiZXhwIjoxNzU1NzE4NzQ1LCJzdWIiOiJob3N0LmV4cC5FeHBvbmVudCJ9.JuYDdyt1a9H2MzSRgIO5lzs__MYFh6_r8NS7X7PX9NOotRZ1beDfvp7Np9iao-s1wQ9yqQeBidqjWb8cH4UDVw",
        // appBundleIdentifier: 'com.english.now',
      },
      google: {
        clientId:
          "434428624385-c6f7ntt5bbhm8vidagapisc76dh9l0em.apps.googleusercontent.com",
        clientSecret: "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",
      },
    },
  });
};

export type Auth = ReturnType<typeof auth>;
export type User = Auth["$Infer"]["Session"]["user"];
export type Session = Auth["$Infer"]["Session"]["session"];
