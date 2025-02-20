import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createClient } from '@repo/db'
import { schema } from '@repo/db'

export const auth = betterAuth({
    database: drizzleAdapter(createClient('postgresql://neondb_owner:npg_m5Ik9oNCLwus@ep-old-hat-a2vj5mdt-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'), {
        provider: "pg",
        schema: schema,
    }),
    // trustedOrigins: ['http://localhost:8081', 'exp://192.168.1.X:8081'],
    trustedOrigins: ['*'],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        apple: {
            clientId: 'com.english.now',
            clientSecret: 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjU1Nlg1TUxSNVMifQ.eyJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiaXNzIjoiNkdaRjlMVlU3MiIsImlhdCI6MTczOTk5NjE0NSwiZXhwIjoxNzU1NTQ0NzYyLCJzdWIiOiJlbmdsaXNoLm5vdyJ9.MMEivD1aLTsf2EI4IZRhAC_WGt-qll-17bB6LY1jsktyeeI0EN9GigzRtLhnPcdxn0bVpYYRYr6VQtyapc2XxA',
            // appBundleIdentifier: 'com.english.now',
        },
        google: {
            clientId: '434428624385-c6f7ntt5bbhm8vidagapisc76dh9l0em.apps.googleusercontent.com',
            clientSecret: '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',
        }
    }
});