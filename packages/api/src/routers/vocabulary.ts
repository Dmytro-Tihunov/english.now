import { and, db, eq, vocabularyPhrase, vocabularyWord } from "@english.now/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

export const vocabularyRouter = router({
	// ─── Words ─────────────────────────────────────────────────────────────────

	// Get vocabulary words with filtering
	getVocabulary: protectedProcedure
		.input(
			z.object({
				category: z.string().optional(),
				level: z.string().optional(),
				mastery: z.string().optional(),
				search: z.string().optional(),
				limit: z.number().min(1).max(200).default(50),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			const words = await db
				.select()
				.from(vocabularyWord)
				.where(eq(vocabularyWord.userId, ctx.session.user.id))
				.limit(input.limit)
				.offset(input.offset);

			let filtered = words;
			if (input.category) {
				filtered = filtered.filter((w) => w.category === input.category);
			}
			if (input.level) {
				filtered = filtered.filter((w) => w.level === input.level);
			}
			if (input.mastery) {
				filtered = filtered.filter((w) => w.mastery === input.mastery);
			}
			if (input.search) {
				const search = input.search.toLowerCase();
				filtered = filtered.filter(
					(w) =>
						w.word.toLowerCase().includes(search) ||
						w.definition.toLowerCase().includes(search),
				);
			}

			return filtered;
		}),

	// Add a single custom word
	addWord: protectedProcedure
		.input(
			z.object({
				word: z.string().min(1),
				translation: z.string().optional(),
				definition: z.string().min(1),
				level: z.string(),
				category: z.string().optional(),
				tags: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await db.insert(vocabularyWord).values({
				id,
				userId: ctx.session.user.id,
				word: input.word,
				translation: input.translation,
				definition: input.definition,
				level: input.level,
				mastery: "new",
				category: input.category,
				tags: input.tags,
				source: "custom",
			});
			return { id };
		}),

	// Bulk add words (from explore/generated list)
	addWords: protectedProcedure
		.input(
			z.object({
				words: z.array(
					z.object({
						word: z.string().min(1),
						translation: z.string().optional(),
						definition: z.string().min(1),
						level: z.string(),
						category: z.string().optional(),
						tags: z.array(z.string()).optional(),
					}),
				),
				source: z.enum(["explore", "custom"]).default("explore"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const rows = input.words.map((w) => ({
				id: crypto.randomUUID(),
				userId: ctx.session.user.id,
				word: w.word,
				translation: w.translation,
				definition: w.definition,
				level: w.level,
				mastery: "new" as const,
				category: w.category,
				tags: w.tags,
				source: input.source,
			}));

			// Insert in batches of 50
			for (let i = 0; i < rows.length; i += 50) {
				const batch = rows.slice(i, i + 50);
				await db.insert(vocabularyWord).values(batch);
			}

			return { count: rows.length };
		}),

	// Delete a word (verify ownership)
	deleteWord: protectedProcedure
		.input(z.object({ wordId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await db
				.delete(vocabularyWord)
				.where(
					and(
						eq(vocabularyWord.id, input.wordId),
						eq(vocabularyWord.userId, ctx.session.user.id),
					),
				);
			return { success: true };
		}),

	// Update word mastery level
	updateWordMastery: protectedProcedure
		.input(
			z.object({
				wordId: z.string(),
				mastery: z.enum(["new", "learning", "reviewing", "mastered"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await db
				.update(vocabularyWord)
				.set({ mastery: input.mastery })
				.where(
					and(
						eq(vocabularyWord.id, input.wordId),
						eq(vocabularyWord.userId, ctx.session.user.id),
					),
				);
			return { success: true };
		}),

	// ─── Phrases ───────────────────────────────────────────────────────────────

	// Get phrases with filtering
	getPhrases: protectedProcedure
		.input(
			z.object({
				category: z.string().optional(),
				level: z.string().optional(),
				mastery: z.string().optional(),
				limit: z.number().min(1).max(100).default(50),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			const phrases = await db
				.select()
				.from(vocabularyPhrase)
				.where(eq(vocabularyPhrase.userId, ctx.session.user.id))
				.limit(input.limit)
				.offset(input.offset);

			let filtered = phrases;
			if (input.category) {
				filtered = filtered.filter((p) => p.category === input.category);
			}
			if (input.level) {
				filtered = filtered.filter((p) => p.level === input.level);
			}
			if (input.mastery) {
				filtered = filtered.filter((p) => p.mastery === input.mastery);
			}

			return filtered;
		}),

	// Add a single custom phrase
	addPhrase: protectedProcedure
		.input(
			z.object({
				phrase: z.string().min(1),
				meaning: z.string().min(1),
				exampleUsage: z.string().optional(),
				category: z.string().optional(),
				level: z.string(),
				literalTranslation: z.string().optional(),
				tags: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await db.insert(vocabularyPhrase).values({
				id,
				userId: ctx.session.user.id,
				phrase: input.phrase,
				meaning: input.meaning,
				exampleUsage: input.exampleUsage,
				category: input.category,
				level: input.level,
				mastery: "new",
				literalTranslation: input.literalTranslation,
				tags: input.tags,
				source: "custom",
			});
			return { id };
		}),

	// Bulk add phrases
	addPhrases: protectedProcedure
		.input(
			z.object({
				phrases: z.array(
					z.object({
						phrase: z.string().min(1),
						meaning: z.string().min(1),
						exampleUsage: z.string().optional(),
						category: z.string().optional(),
						level: z.string(),
						literalTranslation: z.string().optional(),
						tags: z.array(z.string()).optional(),
					}),
				),
				source: z.enum(["explore", "custom"]).default("explore"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const rows = input.phrases.map((p) => ({
				id: crypto.randomUUID(),
				userId: ctx.session.user.id,
				phrase: p.phrase,
				meaning: p.meaning,
				exampleUsage: p.exampleUsage,
				category: p.category,
				level: p.level,
				mastery: "new" as const,
				literalTranslation: p.literalTranslation,
				tags: p.tags,
				source: input.source,
			}));

			await db.insert(vocabularyPhrase).values(rows);
			return { count: rows.length };
		}),

	// Delete a phrase (verify ownership)
	deletePhrase: protectedProcedure
		.input(z.object({ phraseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await db
				.delete(vocabularyPhrase)
				.where(
					and(
						eq(vocabularyPhrase.id, input.phraseId),
						eq(vocabularyPhrase.userId, ctx.session.user.id),
					),
				);
			return { success: true };
		}),

	// Update phrase mastery level
	updatePhraseMastery: protectedProcedure
		.input(
			z.object({
				phraseId: z.string(),
				mastery: z.enum(["new", "learning", "reviewing", "mastered"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await db
				.update(vocabularyPhrase)
				.set({ mastery: input.mastery })
				.where(
					and(
						eq(vocabularyPhrase.id, input.phraseId),
						eq(vocabularyPhrase.userId, ctx.session.user.id),
					),
				);
			return { success: true };
		}),
});

export type VocabularyRouter = typeof vocabularyRouter;
