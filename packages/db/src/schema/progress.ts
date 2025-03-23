import { pgTable, text, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { user } from "./user";
import { course } from "./course";
import { unit } from "./unit";
import { lesson } from "./lesson";
import { grammarRules } from "./grammar";

export const progressStatusEnum = pgEnum('progress_status', ['not_started', 'in_progress', 'completed']);

export const userGrammarProgress = pgTable("user_grammar_progress", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    grammarId: integer('grammar_id').notNull().references(() => grammarRules.id, { onDelete: 'cascade' }),
    status: progressStatusEnum('status').notNull().default('not_started'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userCourseProgress = pgTable("user_course_progress", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    courseId: integer('course_id').notNull().references(() => course.id, { onDelete: 'cascade' }),
    status: progressStatusEnum('status').notNull().default('not_started'),
    lastAccessedAt: timestamp('last_accessed_at').notNull(),
    lastUnitId: integer('last_unit_id').references(() => unit.id),  
    lastLessonId: integer('last_lesson_id').references(() => lesson.id),
    timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(), 
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userUnitProgress = pgTable("user_unit_progress", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    unitId: integer('unit_id').notNull().references(() => unit.id, { onDelete: 'cascade' }),
    status: progressStatusEnum('status').notNull().default('not_started'),
    timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});


export const userLessonProgress = pgTable("user_lesson_progress", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id').notNull().references(() => lesson.id, { onDelete: 'cascade' }),
    status: progressStatusEnum('status').notNull().default('not_started'),
    score: integer('score'),
    timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
    attempts: integer('attempts').notNull().default(0),
    lastAttemptAt: timestamp('last_attempt_at'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});


