import { pgTable, text, integer, timestamp, uuid, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { unit } from "./unit";
import { exercise } from "./exercise";

export const lessonTypeEnum = pgEnum('lesson_type', [
    'GRAMMAR',
    'VOCABULARY',
    'READING',
    'LISTENING',
    'SPEAKING',
    'WRITING',
    'PRONUNCIATION',
    'MIXED'
  ])


export const lesson = pgTable('lesson', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    unitId: integer('unit_id').notNull().references(() =>  unit.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    type: lessonTypeEnum('type').notNull(),
    orderIndex: integer('order_index').notNull(),
    estimatedTime: integer('estimated_time'),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

export const lessonRelations = relations(lesson, ({ many }) => ({
  exercises: many(exercise),
}));
