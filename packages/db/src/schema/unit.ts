import { pgTable, text, timestamp, boolean, integer, uuid, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { course } from "./course";
import { lesson } from "./lesson";
import { grammarRules } from "./grammar";

export const unit = pgTable("unit", {
	id: uuid('id').defaultRandom().primaryKey(),
	courseId: integer('course_id').notNull().references(() => course.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
    orderIndex: integer('order_index').notNull(),
	isPublished: boolean('is_published').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	metadata: jsonb('metadata').$type<{
		intendedGrammarFocus: string[];
		intendedVocabularyThemes: string[];
		ukrainianTitle: string;
		ukrainianDescription: string;
		version: number;
		modelUsed: string;
      }>(),
});


export const unitsRelations = relations(unit, ({ many, one }) => ({
	lessons: many(lesson),
	grammarRules: one(grammarRules, {
		fields: [unit.id],
		references: [grammarRules.unitId],
	}),
}));