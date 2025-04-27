import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { NeonHttpDatabase } from "@repo/db";
import { schema, eq } from "@repo/db";
import { z } from "zod";
import { Variables } from "../../types";

const app = new OpenAPIHono<{ Variables: Variables }>();

const updatePreferencesRoute = createRoute({
  method: "post",
  path: "/preferences",
  summary: "Update user preferences",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            age: z.string(),
            interests: z.array(z.string()),
            level: z.string(),
            goals: z.array(z.string()),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Preferences updated successfully",
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
    400: {
      description: "Bad request",
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

const updateOnboardingRoute = createRoute({
  method: "post",
  path: "/onboarding",
  summary: "Update user onboarding status",
  responses: {
    200: {
      description: "Onboarding status updated successfully",
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
    400: {
      description: "Bad request",
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

app.openapi(updatePreferencesRoute, async (c) => {
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;
  const user = c.get("user");

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  try {
    const body = await c.req.json();

    await db
      .insert(schema.userPreferences)
      .values({
        id: crypto.randomUUID(),
        userId: user.id,
        preferences: body,
      })
      .onConflictDoUpdate({
        target: schema.userPreferences.userId,
        set: {
          preferences: body,
        },
      });

    return c.json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return c.json({ message: "Failed to update preferences" }, 400);
  }
});

app.openapi(updateOnboardingRoute, async (c) => {
  const db = c.get("db") as NeonHttpDatabase<typeof schema>;
  const user = c.get("user");

  if (!user) return c.json({ message: "Unauthorized" }, 401);

  try {
    await db
      .update(schema.user)
      .set({
        isOnboarded: true,
      })
      .where(eq(schema.user.id, user.id));

    return c.json({ message: "Onboarding status updated successfully" });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return c.json({ message: "Failed to update onboarding status" }, 400);
  }
});

app.doc("/docs", {
  openapi: "3.0.0",
  info: {
    title: "User API",
    version: "1.0.0",
  },
});

export default app;
