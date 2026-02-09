import "dotenv/config";
import { createContext } from "@english.now/api/context";
import { appRouter } from "@english.now/api/routers/index";
import { auth } from "@english.now/auth";
import { env } from "@english.now/env/server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import conversationRoutes from "./routes/conversation";
import paddleRoutes from "./routes/paddle";
import profileRoutes from "./routes/profile";
import uploadRoutes from "./routes/upload";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "PUT", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// REST API routes for profile
app.route("/api/profile", profileRoutes);

// REST API routes for conversation (streaming support)
app.route("/api/conversation", conversationRoutes);

// REST API routes for file uploads
app.route("/api/upload", uploadRoutes);

// Paddle webhook routes (no auth required — Paddle calls directly)
app.route("/api/paddle", paddleRoutes);

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

import { serve } from "@hono/node-server";

serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
