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
import unit from "./routes/unit";
import lesson from "./routes/lesson";
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
      prompt: `Create a detailed structure for an English learning unit about Present Simple for CEFR A1 level learners.
      The unit should be comprehensive and cover all necessary aspects of this subject.
      
      Return a JSON object with the following structure:
      {
        "title": "Unit title",
        "description": "Detailed unit description",
        "grammarFocus": ["Grammar point 1", "Grammar point 2"],
        "vocabularyThemes": ["Vocabulary theme 1", "Vocabulary theme 2"],
        "estimatedHours": total hours to complete the unit,
        "lessons": [
          {
            "title": "Lesson 1 title",
            "lessonType": "grammar or vocabulary or reading or listening or speaking or writing or mixed",
            "estimatedMinutes": estimated minutes to complete,
            "difficulty": 1-3 (1=easy, 2=medium, 3=hard),
            "description": "Brief lesson description",
            "taskCount": number of tasks to include (2-5)
          },
          // more lessons...
        ]
      }
      
      For a A1 level unit about Present Simple, create 3-6 lessons that progressively build understanding.
      Each lesson should focus on a specific aspect of the subject and include appropriate tasks.`,
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
app.route("/v1/unit", unit);
app.route("/v1/grammar", grammar);
app.route("/v1/lesson", lesson);

export default app;
export type AppType = typeof app;
