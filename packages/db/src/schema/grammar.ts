import { pgTable, text, integer, timestamp, boolean, pgEnum, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { cefrLevelEnum } from "./course";
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

  export const grammarRules = pgTable('grammar_rules', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    unitId: integer('unit_id').references(() => unit.id),
    title: text('title').notNull(),
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