import { expo } from "@better-auth/expo";
import { db } from "@english.now/db";
import * as schema from "@english.now/db/schema/auth";
import { sendEmail } from "@english.now/email";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || "", "mybettertapp://", "exp://"],
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				templateId: process.env.AUTOSEND_RESET_PASSWORD_TEMPLATE_ID || "",
				dynamicData: {
					url,
					name: user.name,
				},
			});
		},
	},
	emailVerification: {
		// autoSignInAfterVerification: true,
		// sendVerificationEmail: async ({ user, url }) => {
		// 	void sendEmail({
		// 		to: user.email,
		// 		templateId: process.env.AUTOSEND_VERIFY_EMAIL_TEMPLATE_ID || "",
		// 		variables: {
		// 			url,
		// 			name: user.name,
		// 		},
		// 	});
		// },
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [expo()],
});
