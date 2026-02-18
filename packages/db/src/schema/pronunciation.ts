import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReadAloudItem = {
	text: string;
	topic: string;
	phonemeFocus: string;
	tips: string;
};

export type TongueTwisterItem = {
	text: string;
	speed: "slow" | "medium" | "fast";
	targetPhonemes: string[];
	tip: string;
};

export type PhonemeResult = {
	phoneme: string;
	accuracyScore: number;
};

export type WordResult = {
	word: string;
	correct: boolean;
	accuracyScore: number;
	errorType:
		| "None"
		| "Omission"
		| "Insertion"
		| "Mispronunciation"
		| "UnexpectedBreak"
		| "MissingBreak"
		| "Monotone";
	phonemes: PhonemeResult[];
};

export type WeakPhoneme = {
	phoneme: string;
	score: number;
	occurrences: number;
	exampleWords: string[];
};

export type PronunciationSessionSummary = {
	averageScore: number;
	averageAccuracy: number;
	averageFluency: number;
	averageProsody: number;
	averageCompleteness: number;
	totalAttempts: number;
	bestScore: number;
	worstScore: number;
	weakWords: string[];
	weakPhonemes: WeakPhoneme[];
	itemScores: { itemIndex: number; bestScore: number; attempts: number }[];
};

// ─── Pronunciation Session ────────────────────────────────────────────────────

export const pronunciationSession = pgTable("pronunciation_session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	mode: text("mode").notNull(), // "read-aloud" | "tongue-twisters"
	difficulty: text("difficulty").notNull(), // "beginner" | "intermediate" | "advanced"
	items: jsonb("items")
		.notNull()
		.$type<ReadAloudItem[] | TongueTwisterItem[]>(),
	status: text("status").notNull().default("active"), // active, completed, abandoned
	summary: jsonb("summary").$type<PronunciationSessionSummary>(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	completedAt: timestamp("completed_at"),
	deletedAt: timestamp("deleted_at"),
});

// ─── Pronunciation Attempt ────────────────────────────────────────────────────

export const pronunciationAttempt = pgTable("pronunciation_attempt", {
	id: text("id").primaryKey(),
	sessionId: text("session_id")
		.notNull()
		.references(() => pronunciationSession.id, { onDelete: "cascade" }),
	itemIndex: integer("item_index").notNull(),
	transcript: text("transcript").notNull(),
	score: integer("score").notNull(),
	accuracyScore: integer("accuracy_score"),
	fluencyScore: integer("fluency_score"),
	completenessScore: integer("completeness_score"),
	prosodyScore: integer("prosody_score"),
	wordResults: jsonb("word_results")
		.notNull()
		.$type<WordResult[]>(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type PronunciationSession = typeof pronunciationSession.$inferSelect;
export type NewPronunciationSession = typeof pronunciationSession.$inferInsert;
export type PronunciationAttempt = typeof pronunciationAttempt.$inferSelect;
export type NewPronunciationAttempt = typeof pronunciationAttempt.$inferInsert;
