import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// ─── Vocabulary Word ──────────────────────────────────────────────────────────

export const vocabularyWord = pgTable("vocabulary_word", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	word: text("word").notNull(),
	translation: text("translation"),
	definition: text("definition").notNull(),
	level: text("level").notNull(), // CEFR: A1, A2, B1, B2, C1, C2
	mastery: text("mastery").notNull().default("new"), // new | learning | reviewing | mastered
	category: text("category"),
	tags: jsonb("tags").$type<string[]>(),
	source: text("source").notNull().default("generated"), // generated | custom | explore
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Vocabulary Phrase ──────────────────────────────────────────────────────────

export const vocabularyPhrase = pgTable("vocabulary_phrase", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	phrase: text("phrase").notNull(),
	meaning: text("meaning").notNull(),
	exampleUsage: text("example_usage"),
	category: text("category"),
	level: text("level").notNull(), // CEFR: A1, A2, B1, B2, C1, C2
	mastery: text("mastery").notNull().default("new"), // new | learning | reviewing | mastered
	literalTranslation: text("literal_translation"),
	tags: jsonb("tags").$type<string[]>(),
	source: text("source").notNull().default("generated"), // generated | custom | explore
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type VocabularyWord = typeof vocabularyWord.$inferSelect;
export type NewVocabularyWord = typeof vocabularyWord.$inferInsert;
export type VocabularyPhrase = typeof vocabularyPhrase.$inferSelect;
export type NewVocabularyPhrase = typeof vocabularyPhrase.$inferInsert;
