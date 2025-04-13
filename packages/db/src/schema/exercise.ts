import { pgTable, text, integer, timestamp, boolean, pgEnum, jsonb, uuid } from "drizzle-orm/pg-core";
import { lesson } from "./lesson";

export interface ExerciseItem {
    id: string;
    text: string;
    correctAnswer: string;
}

export const exerciseTypeEnum = pgEnum("exercise_type", ["multiple_choice", "true_false", "fill_in_the_blank", "matching", "drag_and_drop", "speaking", "writing"]);

export const exercise = pgTable("exercise", {
	id: uuid('id').defaultRandom().primaryKey(),
	lessonId: uuid('lesson_id').notNull().references(() => lesson.id, { onDelete: 'cascade' }), 
	type: exerciseTypeEnum('type').notNull(),
	items: jsonb('items').$type<ExerciseItem[]>(),
	explanation: text('explanation'),
	orderIndex: integer('order_index').notNull(),
	estimatedTime: integer('estimated_time'),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});