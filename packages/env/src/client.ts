import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_SERVER_URL: z.url(),
		VITE_PADDLE_CLIENT_TOKEN: z.string().min(1),
		VITE_PADDLE_ENVIRONMENT: z
			.enum(["sandbox", "production"])
			.default("sandbox"),
	},
	runtimeEnv: {
		VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
		VITE_PADDLE_CLIENT_TOKEN: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
		VITE_PADDLE_ENVIRONMENT: import.meta.env.VITE_PADDLE_ENVIRONMENT,
	},
	emptyStringAsUndefined: true,
});
