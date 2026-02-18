import { auth } from "@english.now/auth";
import { db, eq, userProfile } from "@english.now/db";
import { Hono } from "hono";

const profile = new Hono();

profile.post("/onboarding", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const body = await c.req.json();
	const {
		nativeLanguage,
		proficiencyLevel,
		dailyGoal,
		focusAreas,
		interests,
		goal,
		timezone,
	} = body;

	await db
		.update(userProfile)
		.set({
			nativeLanguage,
			level: proficiencyLevel,
			dailyGoal,
			focusAreas,
			interests,
			goal,
			timezone,
			isOnboardingCompleted: true,
			updatedAt: new Date(),
		})
		.where(eq(userProfile.userId, session.user.id));

	return c.json({ success: true });
});

// Get profile data
profile.get("/", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const [result] = await db
		.select()
		.from(userProfile)
		.where(eq(userProfile.userId, session.user.id))
		.limit(1);

	return c.json(result ?? null);
});

export default profile;
