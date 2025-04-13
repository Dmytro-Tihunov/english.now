import { pgTable, text, integer, timestamp, boolean, pgEnum, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { unit } from "./unit";
import { lesson } from "./lesson";

export const grammarCategoryEnum = pgEnum('grammar_category', [
    'TENSES',
    'ARTICLES',
    'PREPOSITIONS',
    'MODAL_VERBS',
    'CONDITIONALS',
    'PASSIVE_VOICE',
    'REPORTED_SPEECH',
    'CONJUNCTIONS',
    'QUESTIONS',
    'ADJECTIVES_ADVERBS',
    'DETERMINERS',
    'PHRASAL_VERBS',
    'GERUNDS_INFINITIVES',
    'NOUNS',
    'PRONOUNS',
    'WORD_ORDER',
    'QUANTIFIERS',
    'RELATIVE_CLAUSES',
    'SUBJUNCTIVE',
    'PARTICIPLES'
  ])

  const cefrLevelEnum = pgEnum("cefr_level", ["A1", "A2", "B1", "B2", "C1", "C2"]);

  export const grammarRules = pgTable('grammar_rules', {
    id: uuid('id').defaultRandom().primaryKey(),
    unitId: uuid('unit_id').notNull().references(() =>  unit.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    level: cefrLevelEnum('level').notNull(),
    slug: text('slug').notNull().unique(),
    category: grammarCategoryEnum('category').notNull(),
    isPublished: boolean('is_published').default(false),
    htmlContent: text('html_content').notNull(),
    language: text('language').notNull().default('ua'),
    metadata: jsonb('metadata').$type<{
        tags?: string[];
      }>(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  })
  
// Relations
export const grammarRulesRelations = relations(grammarRules, ({ many, one }) => ({
    unit: one(unit, {
        fields: [grammarRules.unitId],
        references: [unit.id],
      }),
    lesson: many(lesson),
  }))