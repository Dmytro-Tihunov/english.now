import { generateText, Output } from "ai";
import { z } from "zod";
import { openai } from "../utils/ai";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const readAloudSchema = z.object({
	items: z.array(
		z.object({
			text: z.string(),
			topic: z.string(),
			phonemeFocus: z.string(),
			tips: z.string(),
		}),
	),
});

const tongueTwisterSchema = z.object({
	items: z.array(
		z.object({
			text: z.string(),
			speed: z.enum(["slow", "medium", "fast"]),
			targetPhonemes: z.array(z.string()),
			tip: z.string(),
		}),
	),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type GeneratedReadAloudItem = z.infer<
	typeof readAloudSchema
>["items"][number];

export type GeneratedTongueTwisterItem = z.infer<
	typeof tongueTwisterSchema
>["items"][number];

// ─── Generate Read Aloud Content ──────────────────────────────────────────────

export async function generateReadAloudContent(options: {
	level: string;
	interests?: string[];
	count?: number;
}): Promise<GeneratedReadAloudItem[]> {
	const { level, interests, count = 5 } = options;

	const interestContext =
		interests && interests.length > 0
			? `The learner is interested in: ${interests.join(", ")}. Try to incorporate these topics naturally.`
			: "Use a variety of everyday topics.";

	const levelGuidance =
		{
			beginner:
				"Use simple, short sentences (5-10 words). Common vocabulary only. Simple present and past tense.",
			intermediate:
				"Use moderate sentences (10-20 words). Include some compound sentences. Mix of tenses and some phrasal verbs.",
			advanced:
				"Use complex sentences (15-30 words). Include subordinate clauses, advanced vocabulary, and varied intonation patterns.",
		}[level] ||
		"Use moderate sentences appropriate for an intermediate learner.";

	const systemPrompt = `You are an expert English pronunciation coach. Generate practice texts for reading aloud.

Each item should:
- Be a single sentence or short passage appropriate for reading aloud
- Focus on a specific pronunciation challenge (a phoneme, stress pattern, or intonation pattern)
- Include a practical tip for pronouncing it well

Level guidance: ${levelGuidance}

${interestContext}

Generate exactly ${count} items. Make each one focus on a different pronunciation aspect.`;

	const userPrompt = `Generate ${count} English read-aloud practice sentences for a ${level} level learner. Each should target different pronunciation challenges like vowel sounds, consonant clusters, word stress, sentence rhythm, or linking sounds.`;

	const { output } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: readAloudSchema }),
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.8,
	});

	if (!output) {
		throw new Error("Failed to generate read aloud content");
	}

	return output.items;
}

// ─── Generate Tongue Twister Content ──────────────────────────────────────────

export async function generateTongueTwisterContent(options: {
	level: string;
	focusPhonemes?: string[];
	count?: number;
}): Promise<GeneratedTongueTwisterItem[]> {
	const { level, focusPhonemes, count = 5 } = options;

	const phonemeContext =
		focusPhonemes && focusPhonemes.length > 0
			? `Focus especially on these phonemes the learner struggles with: ${focusPhonemes.join(", ")}.`
			: "Cover a variety of challenging English phonemes.";

	const levelGuidance =
		{
			beginner:
				"Short tongue twisters (4-8 words). Repeat simple sound patterns. Mark all as 'slow' speed.",
			intermediate:
				"Medium tongue twisters (8-15 words). More complex sound combinations. Mix of 'slow' and 'medium' speeds.",
			advanced:
				"Long and complex tongue twisters (10-20 words). Intricate sound patterns and rapid alternation. Mix of 'medium' and 'fast' speeds.",
		}[level] ||
		"Medium tongue twisters appropriate for an intermediate learner.";

	const systemPrompt = `You are an expert English pronunciation coach specializing in tongue twisters.

Generate creative, fun tongue twisters that target specific pronunciation challenges.

Each item should:
- Be a tongue twister that challenges specific phonemes
- Include the target phonemes being practiced
- Include a tip for mastering it
- Have an appropriate speed rating based on difficulty

Level guidance: ${levelGuidance}

${phonemeContext}

Generate exactly ${count} items. Mix classic-style tongue twisters with original ones. Make them fun and memorable.`;

	const userPrompt = `Generate ${count} tongue twisters for a ${level} level English learner. Each should target different sound combinations. Include both well-known patterns and creative new ones.`;

	const { output } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: tongueTwisterSchema }),
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.9,
	});

	if (!output) {
		throw new Error("Failed to generate tongue twister content");
	}

	return output.items;
}
