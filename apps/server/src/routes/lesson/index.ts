import { NeonHttpDatabase } from "@repo/db";
import { schema, eq, sql } from "@repo/db";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { Variables } from "../../types";
import { z } from "zod";

const app = new OpenAPIHono<{ Variables: Variables }>();

const getRouteId = createRoute({
  method: "get",
  path: "/:slug",
  summary: "Get Lesson by ID",
  responses: {
    200: {
      description: "Lesson fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            lesson: z.any(),
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
      description: "Lesson not found",
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

app.openapi(getRouteId, async (c) => {
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;
  const user = c.get("user");
  const slug = c.req.param("slug");

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  try {
    const lesson = await db
      .select({
        id: schema.lesson.id,
        title: schema.lesson.title,
        description: schema.lesson.description,
        exercises: sql`COALESCE(
          json_agg(
            json_build_object(
              'id', ${schema.exercise.id},
              'type', ${schema.exercise.type},
              'items', ${schema.exercise.items},
              'explanation', ${schema.exercise.explanation},
              'orderIndex', ${schema.exercise.orderIndex},
              'estimatedTime', ${schema.exercise.estimatedTime},
              'isPublished', ${schema.exercise.isPublished}
            )
          ) FILTER (WHERE ${schema.exercise.id} IS NOT NULL),
          '[]'::json
        )`,
      })
      .from(schema.lesson)
      .leftJoin(schema.exercise, eq(schema.lesson.id, schema.exercise.lessonId))
      .where(eq(schema.lesson.id, slug))
      .groupBy(schema.lesson.id, schema.lesson.title, schema.lesson.description);

    if (!lesson.length) {
      return c.json({ message: "Lesson not found" }, 404);
    }

    if (!lesson[0].exercises.length) {
      console.log("Lesson has no exercises", lesson[0]);
      // return c.json({ message: "Lesson has no exercises" }, 404);
    }

    return c.json({
      message: "Lesson fetched successfully",
      lesson: lesson[0],
    });
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return c.json({ message: "Failed to fetch lesson" }, 400);
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
