import { pgTable, text, timestamp, boolean, pgEnum, jsonb, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { unit } from "./unit";
import { userCourseProgress } from "./progress";

export const cefrLevelEnum = pgEnum("cefr_level", ["A1", "A2", "B1", "B2", "C1", "C2"]);

export const course = pgTable("course", {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	title: text('title').notNull(),
	description: text('description'),
	level: cefrLevelEnum('level').notNull(),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	metadata: jsonb('metadata')
});

export const coursesRelations = relations(course, ({ many }) => ({
	units: many(unit),
	userProgress: many(userCourseProgress),
}));