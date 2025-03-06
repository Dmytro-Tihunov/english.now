import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { course } from '@repo/db/src/schema'
import { z } from "zod";

type Variables = { 
    db: any,
    auth: any,
}

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
                        message: z.string()
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
    }
}
})

app.openapi(
   getRoute,
    async (c) => {
        const db = c.get('db')
        const courses = await db.select().from(course)
        return c.json({  courses, user: c.get('user'), session: c.get('session') })
    }
)

export default app;