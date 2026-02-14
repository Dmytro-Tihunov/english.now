import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// ─── Learning Path ────────────────────────────────────────────────────────────

export const learningPath = pgTable("learning_path", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	level: text("level").notNull(), // CEFR: A1, A2, B1, B2, C1, C2
	goal: text("goal").notNull(),
	focusAreas: jsonb("focus_areas").$type<string[]>().notNull(),
	status: text("status").notNull().default("generating"), // generating | ready | failed
	generatedAt: timestamp("generated_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Unit ─────────────────────────────────────────────────────────────────────

export const unit = pgTable("unit", {
	id: text("id").primaryKey(),
	learningPathId: text("learning_path_id")
		.notNull()
		.references(() => learningPath.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	order: integer("order").notNull(),
	status: text("status").notNull().default("locked"), // locked | active | completed
	progress: integer("progress").notNull().default(0), // 0-100
});

// ─── Lesson ───────────────────────────────────────────────────────────────────

export type ExerciseType = "lecture" | "practice" | "quiz" | "conversation";

export interface GrammarPoint {
	title: string;
	description: string;
}

export interface WordToLearn {
	word: string;
	translation: string;
}

export interface LessonContent {
	description: string;
	wordCount: number;
	grammarCount: number;
	exercises: ExerciseType[];
	grammarPoints: GrammarPoint[];
	wordsToLearn: WordToLearn[];
}

export const lesson = pgTable("lesson", {
	id: text("id").primaryKey(),
	unitId: text("unit_id")
		.notNull()
		.references(() => unit.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	subtitle: text("subtitle"),
	type: text("type").notNull(), // grammar | vocabulary | pronunciation | explanation | reading | listening | speaking | practice
	order: integer("order").notNull(),
	status: text("status").notNull().default("locked"), // locked | available | current | completed
	progress: integer("progress").notNull().default(0), // 0-100
	content: jsonb("content").$type<LessonContent>(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type LearningPath = typeof learningPath.$inferSelect;
export type NewLearningPath = typeof learningPath.$inferInsert;
export type Unit = typeof unit.$inferSelect;
export type NewUnit = typeof unit.$inferInsert;
export type Lesson = typeof lesson.$inferSelect;
export type NewLesson = typeof lesson.$inferInsert;
