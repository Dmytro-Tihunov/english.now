import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { NeonHttpDatabase } from "@repo/db";
import { schema, eq, sql } from "@repo/db";
import { z } from "zod";
import { Variables } from "../../types";

const app = new OpenAPIHono<{ Variables: Variables }>();

const getRoute = createRoute({
  method: "get",
  path: "/",
  summary: "Get courses",
  responses: {
    200: {
      description: "Courses fetched s uccessfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            courses: z.array(z.any()),
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

app.openapi(getRoute, async (c) => {
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;
  const user = c.get("user");

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  try {
    const userLearningState = await db
      .select()
      .from(schema.userLearningState)
      .where(eq(schema.userLearningState.userId, user.id))
      .then((rows) => rows[0]);

    if (!userLearningState) {
      return c.json({ message: "User learning state not found" }, 400);
    }

    const courses = await db
      .select({
        id: schema.unit.id,
        courseId: schema.unit.courseId,
        title: schema.unit.title,
        description: schema.unit.description,
        orderIndex: schema.unit.orderIndex,
        isPublished: schema.unit.isPublished,
        lessonsCount: sql<number>`count(${schema.lesson.id})`.mapWith(Number),
        lessons: sql`json_agg(
            json_build_object(
              'id', ${schema.lesson.id},
              'title', ${schema.lesson.title},
              'orderIndex', ${schema.lesson.orderIndex},
              'isPublished', ${schema.lesson.isPublished}
            )
          )`,
        grammarRules: sql`json_agg(
             json_build_object(
              'id', ${schema.grammarRules.id},
              'slug', ${schema.grammarRules.slug}
            )
          )`,
      })
      .from(schema.unit)
      .leftJoin(
        schema.grammarRules,
        eq(schema.unit.id, schema.grammarRules.unitId),
      )
      .leftJoin(schema.lesson, eq(schema.unit.id, schema.lesson.unitId))
      .where(eq(schema.unit.courseId, userLearningState.activeCourseId ?? 0))
      .groupBy(
        schema.unit.id,
        schema.unit.courseId,
        schema.unit.title,
        schema.unit.description,
        schema.unit.orderIndex,
        schema.unit.isPublished,
      )
      .orderBy(schema.unit.orderIndex);

    // const courses = await db
    //     .select()
    //     .from(schema.course)
    //     .leftJoin(schema.unit, eq(schema.course.id, schema.unit.courseId))
    //     .leftJoin(schema.lesson, eq(schema.unit.id, schema.lesson.unitId))
    //     .leftJoin(schema.exercise, eq(schema.lesson.id, schema.exercise.lessonId))
    //     .orderBy(
    //         schema.unit.orderIndex,
    //         schema.lesson.orderIndex,
    //         schema.exercise.orderIndex
    //     ).where(eq(schema.course.isPublished, true))

    return c.json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return c.json({ message: "Failed to fetch courses" }, 400);
  }
});

export default app;
