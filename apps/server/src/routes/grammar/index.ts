import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { NeonHttpDatabase } from "@repo/db";
import { schema, eq } from "@repo/db";
import { z } from "zod";
import { Variables } from "../../types";
import { GrammarListSchema, GrammarSchema } from "./schema";

const app = new OpenAPIHono<{ Variables: Variables }>();

const getRoute = createRoute({
  method: "get",
  path: "/",
  summary: "Get Grammar Rules",
  responses: {
    200: {
      description: "Grammar Rules fetched successfully",
      content: {
        "application/json": {
          schema: GrammarListSchema,
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

const getRouteId = createRoute({
  method: "get",
  path: "/:slug",
  summary: "Get Grammar Rule by ID",
  responses: {
    200: {
      description: "Grammar Rule fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            grammar: z.any(),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: "Grammar Rule not found",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
  request: {
    params: z.object({
      slug: z.string(),
    }),
  },
});

app.openapi(getRoute, async (c) => {
  const user = c.get("user");
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  try {
    const data = await db
      .select({
        id: schema.grammarRules.id,
        title: schema.grammarRules.title,
        slug: schema.grammarRules.slug,
        category: schema.grammarRules.category,
      })
      .from(schema.grammarRules)
      .where(eq(schema.grammarRules.isPublished, true));

    return c.json(data, 200);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return c.json({ message: "Failed to fetch courses" }, 400);
  }
});

app.openapi(getRouteId, async (c) => {
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;
  const user = c.get("user");

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  try {
    const grammar = await db
      .select()
      .from(schema.grammarRules)
      .where(eq(schema.grammarRules.slug, c.req.param("slug")));

    console.log(grammar);

    return c.json({
      message: "Grammar Rule fetched successfully",
      grammar: grammar[0],
    });
  } catch (error) {
    console.error("Error fetching grammar rule:", error);
    return c.json({ message: "Failed to fetch grammar rule" }, 400);
  }
});

app.doc("/docs", {
  openapi: "3.0.0",
  info: {
    title: "Grammar API",
    version: "1.0.0",
  },
});

export default app;
