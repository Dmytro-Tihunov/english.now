import {
	db,
	eq,
	learningPath,
	lesson,
	unit,
	userProfile,
	vocabularyPhrase,
	vocabularyWord,
} from "@english.now/db";
import { generateText, Output } from "ai";
import { z } from "zod";
import { openai } from "../utils/ai";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressCallback = (event: {
	step: "outline" | "lessons" | "vocabulary" | "phrases" | "complete";
	progress: number;
	message: string;
}) => void;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const courseOutlineSchema = z.object({
	units: z.array(
		z.object({
			title: z.string(),
			description: z.string(),
			lessons: z.array(
				z.object({
					title: z.string(),
					subtitle: z.string(),
					type: z.string(),
				}),
			),
		}),
	),
});

const lessonContentSchema = z.object({
	description: z.string(),
	wordCount: z.number(),
	grammarCount: z.number(),
	exercises: z.array(z.enum(["lecture", "practice", "quiz", "conversation"])),
	grammarPoints: z.array(
		z.object({
			title: z.string(),
			description: z.string(),
		}),
	),
	wordsToLearn: z.array(
		z.object({
			word: z.string(),
			translation: z.string(),
		}),
	),
});

const generatedLessonContentSchema = z.object({
	lessons: z.array(
		z.object({
			title: z.string(),
			content: lessonContentSchema,
		}),
	),
});

const generatedVocabularySchema = z.object({
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

// ─── Level Mapping ────────────────────────────────────────────────────────────

const LEVEL_TO_CEFR: Record<string, string> = {
	beginner: "A1",
	elementary: "A2",
	intermediate: "B1",
	"upper-intermediate": "B2",
	advanced: "C1",
};

// ─── Main Generation Function ─────────────────────────────────────────────────

export async function generateLearningPath(
	userId: string,
	onProgress?: ProgressCallback,
): Promise<{ learningPathId: string }> {
	// 1. Read user profile
	const [profile] = await db
		.select()
		.from(userProfile)
		.where(eq(userProfile.userId, userId))
		.limit(1);

	if (!profile) {
		throw new Error("User profile not found");
	}

	const cefrLevel = LEVEL_TO_CEFR[profile.level ?? "intermediate"] ?? "B1";
	const goal = profile.goal ?? "general";
	const focusAreas = (profile.focusAreas ?? [
		"vocabulary",
		"grammar",
	]) as string[];
	const nativeLanguage = profile.nativeLanguage ?? "uk"; // Ukrainian default

	const nativeLanguageName = getNativeLanguageName(nativeLanguage);

	// 2. Create learning path record
	const learningPathId = crypto.randomUUID();
	await db.insert(learningPath).values({
		id: learningPathId,
		userId,
		level: cefrLevel,
		goal,
		focusAreas,
		status: "generating",
	});

	try {
		// ── Step 1: Generate course outline ───────────────────────────────────
		const outline = await generateCourseOutline(cefrLevel, goal, focusAreas);
		const savedUnits = await saveCourseOutline(learningPathId, outline);

		onProgress?.({
			step: "outline",
			progress: 25,
			message: "Course structure created",
		});

		// ── Step 2: Generate lesson content (parallel per unit) ───────────────
		await generateAndSaveLessonContent(
			savedUnits,
			cefrLevel,
			goal,
			nativeLanguageName,
		);

		onProgress?.({
			step: "lessons",
			progress: 50,
			message: "Lesson content generated",
		});

		// ── Step 3: Generate vocabulary ───────────────────────────────────────
		await generateAndSaveVocabulary(
			userId,
			cefrLevel,
			goal,
			nativeLanguageName,
		);

		onProgress?.({
			step: "vocabulary",
			progress: 75,
			message: "Vocabulary built",
		});

		// ── Step 4: Generate phrases ─────────────────────────────────────────
		await generateAndSavePhrases(userId, cefrLevel, goal, nativeLanguageName);

		// ── Mark complete ─────────────────────────────────────────────────────
		await db
			.update(learningPath)
			.set({ status: "ready", generatedAt: new Date() })
			.where(eq(learningPath.id, learningPathId));

		onProgress?.({
			step: "complete",
			progress: 100,
			message: "Your learning path is ready!",
		});

		return { learningPathId };
	} catch (error) {
		// Mark as failed on any error
		await db
			.update(learningPath)
			.set({ status: "failed" })
			.where(eq(learningPath.id, learningPathId));

		throw error;
	}
}

// ─── Step 1: Course Outline ───────────────────────────────────────────────────

async function generateCourseOutline(
	cefrLevel: string,
	goal: string,
	focusAreas: string[],
): Promise<z.infer<typeof courseOutlineSchema>> {
	const systemPrompt = `You are an expert English language curriculum designer. Create a comprehensive, structured learning path for an English learner.

Your output must be valid JSON with this exact structure:
{
  "units": [
    {
      "title": "Unit title",
      "description": "Brief unit description",
      "lessons": [
        {
          "title": "Lesson title",
          "subtitle": "Short lesson description",
          "type": "grammar|vocabulary|pronunciation|explanation|reading|listening|speaking|practice"
        }
      ]
    }
  ]
}

Rules:
- Create exactly 6 units, progressing from easier to harder topics
- Each unit should have 4-5 lessons
- Lesson types should be varied and match the user's focus areas
- Content must be appropriate for the specified CEFR level
- Topics should be practical and relevant to the user's learning goal
- Each unit should build on the previous one`;

	const userPrompt = `Create a learning path for:
- CEFR Level: ${cefrLevel}
- Learning Goal: ${goal}
- Focus Areas: ${focusAreas.join(", ")}

Make the content practical, engaging, and progressive. The topics should be relevant to someone learning English for "${goal}" purposes.`;

	const { output } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: courseOutlineSchema }),
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.7,
	});

	if (!output) {
		throw new Error("Failed to generate course outline");
	}

	return output;
}

async function saveCourseOutline(
	learningPathId: string,
	outline: z.infer<typeof courseOutlineSchema>,
): Promise<
	{
		unitId: string;
		unitTitle: string;
		lessons: { title: string; subtitle: string; type: string }[];
	}[]
> {
	const savedUnits: {
		unitId: string;
		unitTitle: string;
		lessons: { title: string; subtitle: string; type: string }[];
	}[] = [];

	for (let i = 0; i < outline.units.length; i++) {
		const u = outline.units[i];
		if (!u) continue;
		const unitId = crypto.randomUUID();

		await db.insert(unit).values({
			id: unitId,
			learningPathId,
			title: u.title,
			description: u.description,
			order: i + 1,
			status: i === 0 ? "active" : "locked",
			progress: 0,
		});

		const lessonRows = u.lessons.map((l, j) => ({
			id: crypto.randomUUID(),
			unitId,
			title: l.title,
			subtitle: l.subtitle,
			type: l.type,
			order: j + 1,
			status: i === 0 && j === 0 ? "current" : i === 0 ? "available" : "locked",
			progress: 0,
		}));

		await db.insert(lesson).values(lessonRows);

		savedUnits.push({
			unitId,
			unitTitle: u.title,
			lessons: u.lessons,
		});
	}

	return savedUnits;
}

// ─── Step 2: Lesson Content ───────────────────────────────────────────────────

async function generateAndSaveLessonContent(
	savedUnits: {
		unitId: string;
		unitTitle: string;
		lessons: { title: string; subtitle: string; type: string }[];
	}[],
	cefrLevel: string,
	goal: string,
	nativeLanguageName: string,
): Promise<void> {
	const systemPrompt = `You are an expert English language teacher creating detailed lesson content.

Your output must be valid JSON with this exact structure:
{
  "lessons": [
    {
      "title": "Exact lesson title as provided",
      "content": {
        "description": "2-3 sentence lesson description",
        "wordCount": 6,
        "grammarCount": 1,
        "exercises": ["lecture", "practice", "quiz", "conversation"],
        "grammarPoints": [
          { "title": "Grammar concept", "description": "Clear explanation of the grammar point" }
        ],
        "wordsToLearn": [
          { "word": "English word", "translation": "Translation in ${nativeLanguageName}" }
        ]
      }
    }
  ]
}

Rules:
- Match each lesson by its exact title
- wordCount must equal the length of wordsToLearn array
- grammarCount must equal the length of grammarPoints array
- exercises must be an array of 2-4 items from: "lecture", "practice", "quiz", "conversation"
- Provide 6-10 words per vocabulary/grammar lesson, 0 for pronunciation-only lessons
- Grammar points should be clear and practical
- Translations must be in ${nativeLanguageName}
- Content difficulty must match CEFR ${cefrLevel} level`;

	// Generate lesson content in parallel across units
	const promises = savedUnits.map(async (savedUnit) => {
		const userPrompt = `Generate detailed lesson content for the unit "${savedUnit.unitTitle}" at CEFR ${cefrLevel} level for someone learning English for "${goal}".

Lessons to generate content for:
${savedUnit.lessons.map((l, i) => `${i + 1}. "${l.title}" (${l.subtitle}) - Type: ${l.type}`).join("\n")}

Provide rich, educational content appropriate for the ${cefrLevel} level.`;

		const { output: generated } = await generateText({
			model: openai("gpt-4o-mini"),
			output: Output.object({ schema: generatedLessonContentSchema }),
			system: systemPrompt,
			prompt: userPrompt,
			temperature: 0.7,
		});

		if (!generated) {
			throw new Error(
				`Failed to generate lesson content for unit "${savedUnit.unitTitle}"`,
			);
		}

		// Get existing lesson records for this unit
		const existingLessons = await db
			.select()
			.from(lesson)
			.where(eq(lesson.unitId, savedUnit.unitId));

		// Update each lesson with its generated content
		for (const genLesson of generated.lessons) {
			const matchingLesson = existingLessons.find(
				(l) => l.title === genLesson.title,
			);
			if (matchingLesson) {
				await db
					.update(lesson)
					.set({ content: genLesson.content })
					.where(eq(lesson.id, matchingLesson.id));
			}
		}
	});

	await Promise.all(promises);
}

// ─── Step 3: Vocabulary ───────────────────────────────────────────────────────

async function generateAndSaveVocabulary(
	userId: string,
	cefrLevel: string,
	goal: string,
	nativeLanguageName: string,
): Promise<void> {
	const systemPrompt = `You are an expert English vocabulary teacher. Generate a vocabulary list with simple, clear entries.

Your output must be valid JSON with this exact structure:
{
  "words": [
    {
      "word": "English word",
      "translation": "Translation in ${nativeLanguageName}",
      "definition": "Clear, concise definition",
      "level": "${cefrLevel}",
      "category": "Category name",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Rules:
- Generate exactly 80 words
- Words must be appropriate for CEFR ${cefrLevel} level
- Include a mix of nouns, verbs, adjectives, and adverbs
- Categories should be diverse and relevant to the learning goal
- Translations must be in ${nativeLanguageName}
- Definitions should be concise (one sentence max)
- Each word needs at least 1 tag`;

	const userPrompt = `Generate 80 vocabulary words for an English learner at CEFR ${cefrLevel} level whose learning goal is "${goal}".

Include words from these categories:
- Everyday life & social situations
- ${goal}-specific vocabulary
- Common useful words for the level
- Action verbs and descriptive adjectives

The words should be practical and immediately useful.`;

	const { output: generated } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: generatedVocabularySchema }),
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.7,
	});

	if (!generated) {
		throw new Error("Failed to generate vocabulary");
	}

	// Bulk insert vocabulary words
	const wordRows = generated.words.map((w) => ({
		id: crypto.randomUUID(),
		userId,
		word: w.word,
		translation: w.translation,
		definition: w.definition,
		level: w.level || cefrLevel,
		mastery: "new" as const,
		category: w.category,
		tags: w.tags,
		source: "generated" as const,
	}));

	// Insert in batches of 50 to avoid query limits
	for (let i = 0; i < wordRows.length; i += 50) {
		const batch = wordRows.slice(i, i + 50);
		await db.insert(vocabularyWord).values(batch);
	}
}

// ─── Step 4: Phrases ──────────────────────────────────────────────────────────

async function generateAndSavePhrases(
	userId: string,
	cefrLevel: string,
	goal: string,
	nativeLanguageName: string,
): Promise<void> {
	const systemPrompt = `You are an expert English teacher specializing in common phrases and expressions.

Your output must be valid JSON with this exact structure:
{
  "phrases": [
    {
      "phrase": "Common English phrase or expression",
      "meaning": "What the phrase means",
      "exampleUsage": "A natural dialog or sentence using the phrase",
      "category": "Category name",
      "level": "${cefrLevel}",
      "literalTranslation": "Word-by-word translation in ${nativeLanguageName}",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Rules:
- Generate exactly 30 phrases
- Phrases must be appropriate for CEFR ${cefrLevel} level
- Include a mix of: greetings, small talk, opinions, requests, reactions, idioms
- Categories should group related phrases together
- Literal translations help learners understand word order differences
- Example usage should show the phrase in a natural context`;

	const userPrompt = `Generate 30 common English phrases and expressions for an English learner at CEFR ${cefrLevel} level whose learning goal is "${goal}".

Include phrases for:
- Daily conversations and small talk
- ${goal}-related situations
- Expressing opinions and feelings
- Making requests and suggestions
- Common reactions and responses

Phrases should be ones native speakers actually use frequently.`;

	const { output: generated } = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: generatedPhrasesSchema }),
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.7,
	});

	if (!generated) {
		throw new Error("Failed to generate phrases");
	}

	const phraseRows = generated.phrases.map((p) => ({
		id: crypto.randomUUID(),
		userId,
		phrase: p.phrase,
		meaning: p.meaning,
		exampleUsage: p.exampleUsage,
		category: p.category,
		level: p.level || cefrLevel,
		mastery: "new" as const,
		literalTranslation: p.literalTranslation,
		tags: p.tags,
		source: "generated" as const,
	}));

	await db.insert(vocabularyPhrase).values(phraseRows);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNativeLanguageName(code: string): string {
	const languages: Record<string, string> = {
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
	return languages[code] ?? "Ukrainian";
}
