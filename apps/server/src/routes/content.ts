import { auth } from "@english.now/auth";
import { db, eq, learningPath } from "@english.now/db";
import type { Context, Next } from "hono";
import { Hono } from "hono";
import {
	generatePhraseList,
	generateWordList,
} from "../services/generate-custom-list";
import { enqueueGenerateLearningPath } from "../jobs";
import { getQueue } from "../utils/queue";

type Variables = {
	session: Awaited<ReturnType<typeof auth.api.getSession>>;
};

const content = new Hono<{ Variables: Variables }>();

const requireAuth = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	c.set("session", session);
	return next();
};

// POST /api/content/generate — enqueue learning path generation
content.post("/generate", requireAuth, async (c) => {
	const session = c.get("session");
	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const userId = session.user.id;

	const [existing] = await db
		.select()
		.from(learningPath)
		.where(eq(learningPath.userId, userId))
		.limit(1);

	if (existing?.status === "ready") {
		return c.json({ status: "already_exists", learningPathId: existing.id });
	}

	if (existing?.status === "generating") {
		return c.json({ status: "generating", learningPathId: existing.id });
	}

	if (existing?.status === "failed") {
		await db.delete(learningPath).where(eq(learningPath.id, existing.id));
	}

	const boss = getQueue();
	const jobId = await enqueueGenerateLearningPath(boss, { userId });

	return c.json({ status: "queued", jobId });
});

// POST /api/content/generate-list - Generate a custom word or phrase list
content.post("/generate-list", requireAuth, async (c) => {
	const session = c.get("session");
	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const body = await c.req.json<{
		topic: string;
		type: "words" | "phrases";
		level?: string;
		count?: number;
	}>();

	if (!body.topic || !body.type) {
		return c.json({ error: "topic and type are required" }, 400);
	}

	try {
		// Get user profile for native language
		const { userProfile } = await import("@english.now/db");
		const [profile] = await db
			.select()
			.from(userProfile)
			.where(eq(userProfile.userId, session.user.id))
			.limit(1);

		const nativeLanguage = profile?.nativeLanguage ?? "uk";
		const nativeLanguageNames: Record<string, string> = {
			uk: "Ukrainian",
			en: "English",
			fr: "French",
			es: "Spanish",
			de: "German",
			pt: "Portuguese",
			it: "Italian",
			pl: "Polish",
			ja: "Japanese",
			ko: "Korean",
			zh: "Chinese",
			ar: "Arabic",
			hi: "Hindi",
			tr: "Turkish",
		};
		const nativeLanguageName = nativeLanguageNames[nativeLanguage] ?? "Ukrainian";
		const level = body.level ?? profile?.level ?? "B1";

		if (body.type === "words") {
			const words = await generateWordList({
				topic: body.topic,
				level,
				nativeLanguage: nativeLanguageName,
				count: body.count,
			});
			return c.json({ words });
		}

		const phrases = await generatePhraseList({
			topic: body.topic,
			level,
			nativeLanguage: nativeLanguageName,
			count: body.count,
		});
		return c.json({ phrases });
	} catch (error) {
		console.error("Generate list error:", error);
		return c.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to generate list",
			},
			500,
		);
	}
});

export default content;
