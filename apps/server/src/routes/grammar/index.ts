import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { NeonHttpDatabase } from "@repo/db";
import { schema, eq } from "@repo/db";
import { z } from "zod";
import { Variables } from "../../types";

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
          schema: z.object({
            message: z.string(),
            grammar: z.array(z.any()),
          }),
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
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;
  const user = c.get("user");

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  try {
    const grammar = await db
      .select()
      .from(schema.grammarRules)
      .where(eq(schema.grammarRules.isPublished, true));

    return c.json({
      message: "Grammar fetched successfully",
      grammar,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return c.json({ message: "Failed to fetch courses" }, 400);
  }
});

app.openapi(getRouteId, async (c) => {
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;
  const user = c.get("user");

  //   if (!user) return c.json({ message: "Unauthorized" }, 401);

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

export default app;
