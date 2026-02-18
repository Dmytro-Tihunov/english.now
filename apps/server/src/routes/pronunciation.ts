import { auth } from "@english.now/auth";
import type { Context, Next } from "hono";
import { Hono } from "hono";
import { z } from "zod";
import { assessPronunciation } from "../services/pronunciation-assessment";
import { generateTTS } from "../services/tts";

type Variables = {
	session: Awaited<ReturnType<typeof auth.api.getSession>>;
};

const pronunciation = new Hono<{ Variables: Variables }>();

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

const assessSchema = z.object({
	audio: z.string().min(1),
	referenceText: z.string().min(1),
});

pronunciation.post("/assess", requireAuth, async (c) => {
	const body = await c.req.json();
	const { audio, referenceText } = assessSchema.parse(body);

	try {
		const audioBuffer = Buffer.from(audio, "base64");

		const result = await assessPronunciation(audioBuffer, referenceText);

		return c.json(result);
	} catch (error) {
		console.error("Pronunciation assessment error:", error);
		return c.json(
			{
				error: "Failed to assess pronunciation",
				details: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
});

const ttsSchema = z.object({
	text: z.string().min(1).max(5000),
});

pronunciation.post("/tts", requireAuth, async (c) => {
	const body = await c.req.json();
	const { text } = ttsSchema.parse(body);

	try {
		const audioBuffer = await generateTTS(text);

		if (!audioBuffer) {
			return c.json({ error: "Failed to generate speech" }, 500);
		}

		return new Response(audioBuffer, {
			headers: {
				"Content-Type": "audio/mp3",
				"Content-Length": audioBuffer.length.toString(),
			},
		});
	} catch (error) {
		console.error("TTS error:", error);
		return c.json({ error: "Failed to generate speech" }, 500);
	}
});

export default pronunciation;
