import { createDeepgram } from "@ai-sdk/deepgram";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@english.now/env/server";

export const openai = createOpenAI({
	apiKey: env.OPENAI_API_KEY,
});

export const deepgram = createDeepgram({
	apiKey: env.DEEPGRAM_API_KEY,
});
