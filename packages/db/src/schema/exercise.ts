import { pgTable, text, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lesson } from "./lesson";

export const exerciseTypeEnum = pgEnum("exercise_type", ["multiple_choice", "true_false", "fill_in_the_blank", "matching", "drag_and_drop", "speaking", "writing"]);

export const exercise = pgTable("exercise", {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	lessonId: integer('lesson_id').notNull().references(() => lesson.id, { onDelete: 'cascade' }), 
	type: exerciseTypeEnum('type').notNull(),
	content: jsonb('content').$type<{
		question: string;
		instructions?: string;
		// Multiple choice specific fields
		options?: { id: string; text: string; isCorrect: boolean }[];
		// True/false specific fields
		correctAnswer?: boolean;
		// Fill in the blank specific fields
		blanks?: { id: string; correctAnswer: string }[];
		// Matching specific fields
		pairs?: { id: string; left: string; right: string }[];
		// Drag and drop specific fields
		dragItems?: { id: string; text: string; correctPosition: number }[];
		// Speaking specific fields
		audioPrompt?: string;
		acceptedPhrases?: string[];
		// Writing specific fields
		wordLimit?: number;
		sampleAnswer?: string;
		// Common fields for feedback
		feedback?: {
			correct?: string;
			incorrect?: string;
		};
	}>(),
	explanation: text('explanation'),
	isPublished: boolean('is_published').notNull().default(false),
	orderIndex: integer('order_index').notNull(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});