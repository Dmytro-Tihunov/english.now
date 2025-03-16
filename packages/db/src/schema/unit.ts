import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { course } from "./course";
import { lesson } from "./lesson";

export const unit = pgTable("unit", {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	courseId: integer('course_id').notNull().references(() => course.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
    orderIndex: integer('order_index').notNull(),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});


export const unitsRelations = relations(unit, ({ many }) => ({
	lessons: many(lesson),
}));