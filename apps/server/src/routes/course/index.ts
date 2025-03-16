import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { NeonHttpDatabase } from "@repo/db"
import { schema, eq } from "@repo/db";
import { z } from "zod";
import { Variables } from "../../types";

const app = new OpenAPIHono<{ Variables: Variables }>();

const getRoute = createRoute({
    method: "get",
    path: "/",
    summary: "Get courses",
    responses: {
        200: {
            description: "Courses fetched successfully",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        courses: z.array(z.any())
                    })
                }
            }
        },
        400: {
            description: "Bad Request",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        },
    }
})

app.openapi(
    getRoute,
    async (c) =>  {
        const db = c.get('db') as NeonHttpDatabase<typeof schema>
        const user = c.get('user')

        if(!user) return c.json({ message: "Unauthorized" }, 401);

        try {
            const userLearningState = await db.select().from(schema.userLearningState).where(eq(schema.userLearningState.userId, user.id))

            console.log(userLearningState)

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

            const courses = await db
                .select()
              .from(schema.unit)
              .leftJoin(schema.lesson, eq(schema.unit.id, schema.lesson.unitId))
              .leftJoin(schema.exercise, eq(schema.lesson.id, schema.exercise.lessonId))
              .orderBy(
                  schema.unit.orderIndex,
                  schema.lesson.orderIndex,
                  schema.exercise.orderIndex
              )

            return c.json({ 
                message: "Courses fetched successfully", 
                courses 
            })
        } catch (error) {
            console.error('Error fetching courses:', error)
            return c.json({ message: "Failed to fetch courses" }, 400)
        }
    }
)

export default app;