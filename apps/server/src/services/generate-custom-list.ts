import { generateText, Output } from "ai";
import { z } from "zod";
import { openai } from "../utils/ai";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const generatedWordsSchema = z.object({
	words: z.array(
		z.object({
			word: z.string(),
			translation: z.string(),
			definition: z.string(),
			level: z.string(),
			category: z.string(),
			tags: z.array(z.string()),
		}),
	),
});

const generatedPhrasesSchema = z.object({
	phrases: z.array(
		z.object({
			phrase: z.string(),
			meaning: z.string(),
			exampleUsage: z.string(),
			category: z.string(),
			level: z.string(),
			literalTranslation: z.string(),
			tags: z.array(z.string()),
		}),
	),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type GeneratedWord = z.infer<
	typeof generatedWordsSchema
>["words"][number];
export type GeneratedPhrase = z.infer<
	typeof generatedPhrasesSchema
>["phrases"][number];

// ─── Generate Word List ───────────────────────────────────────────────────────

export async function generateWordList(options: {
	topic: string;
	level: string;
	nativeLanguage: string;
	count?: number;
}): Promise<GeneratedWord[]> {
	const { topic, level, nativeLanguage, count = 20 } = options;

	const systemPrompt = `You are an expert English vocabulary teacher. Generate a focused vocabulary list for a specific topic.

Your output must be valid JSON with this exact structure:
{
  "words": [
    {
      "word": "English word",
      "translation": "Translation in ${nativeLanguage}",
      "definition": "Clear, concise definition",
      "level": "${level}",
      "category": "${topic}",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Rules:
- Generate exactly ${count} words
- All words must be relevant to the topic "${topic}"
- Words must be appropriate for CEFR ${level} level
- Translations must be in ${nativeLanguage}
- Definitions should be concise (one sentence max)
- Each word needs at least 1 tag
- Include a variety of word types (nouns, verbs, adjectives)`;

	const userPrompt = `Generate ${count} English vocabulary words about "${topic}" for a CEFR ${level} level learner. The words should be practical and commonly used in the context of ${topic}.`;

	const { output } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: generatedWordsSchema }),
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.7,
	});

	if (!output) {
		throw new Error("Failed to generate word list");
	}

	return output.words;
}

// ─── Generate Phrase List ─────────────────────────────────────────────────────

export async function generatePhraseList(options: {
	topic: string;
	level: string;
	nativeLanguage: string;
	count?: number;
}): Promise<GeneratedPhrase[]> {
	const { topic, level, nativeLanguage, count = 15 } = options;

	const systemPrompt = `You are an expert English teacher specializing in common phrases and expressions.

Your output must be valid JSON with this exact structure:
{
  "phrases": [
    {
      "phrase": "Common English phrase",
      "meaning": "What the phrase means",
      "exampleUsage": "A natural sentence using the phrase",
      "category": "${topic}",
      "level": "${level}",
      "literalTranslation": "Translation in ${nativeLanguage}",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Rules:
- Generate exactly ${count} phrases
- All phrases must be relevant to the topic "${topic}"
- Phrases must be appropriate for CEFR ${level} level
- Literal translations must be in ${nativeLanguage}
- Example usage should show the phrase in a natural context
- Include a mix of formal and informal expressions`;

	const userPrompt = `Generate ${count} common English phrases and expressions about "${topic}" for a CEFR ${level} level learner. Include phrases that native speakers actually use in conversations about ${topic}.`;

	const { output } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: generatedPhrasesSchema }),
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.7,
	});

	if (!output) {
		throw new Error("Failed to generate phrase list");
	}

	return output.phrases;
}
