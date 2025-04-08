import type { Variables, Bindings } from "./types";
import type { Auth } from "./utils/auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { requestId } from "hono/request-id";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { init, authMiddleware } from "./middleware";
import grammar from "./routes/grammar";
import course from "./routes/course";

const app = new OpenAPIHono<{ Bindings: Bindings; Variables: Variables }>({
  strict: false,
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          ok: false,
          source: "custom_error_handler",
        },
        422,
      );
    }
  },
});

app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});

/**
 * Documentation
 */
app.get(
  "/ui",
  swaggerUI({
    url: "/docs",
  }),
);

app.doc("/docs", {
  openapi: "3.0.0",
  info: {
    title: "English Now API",
    version: "1.0.0",
    contact: {
      url: "https://english.now",
      email: "support@english.now",
    },
  },
  servers: [
    {
      url: "http://localhost:8787",
      description: "Local Development",
    },
    {
      url: "https://api.english.now",
      description: "Production",
    },
  ],
});

/**
 * Middleware
 */
app.use("*", requestId());
app.use("*", logger());
app.use("*", init());
app.use("*", authMiddleware());
app.use(
  "*",
  cors({
    origin: ["*"], // Add your Expo development URLs
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", prettyJSON());

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth: Auth = c.get("auth");
  return auth.handler(c.req.raw);
});

/**
 * Ping Pong
 */
app.get("/ping", (c) => {
  return c.json({ message: "pong" });
});

app.get("/ai", async (c) => {
  const result = await c.env.AI.run(
    "@cf/meta/llama-4-scout-17b-16e-instruct" as any,
    {
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates structured English lessons for Ukrainian learners at CEFR A1 level.",
        },
        {
          role: "user",
          content: "tell me a joke",
        },
      ],
    },
    {
      gateway: {
        id: "english-now",
      },
    },
  );
  return c.json({ result });
});

/**
 * API Routes v1
 */
app.route("/v1/course", course);
app.route("/v1/grammar", grammar);

export default app;
export type AppType = typeof app;
