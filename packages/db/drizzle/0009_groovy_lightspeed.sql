CREATE TYPE "public"."exercise_type" AS ENUM('multiple_choice', 'true_false', 'fill_in_the_blank', 'matching', 'drag_and_drop', 'speaking', 'writing');--> statement-breakpoint
CREATE TYPE "public"."grammar_category" AS ENUM('TENSES', 'ARTICLES', 'PREPOSITIONS', 'MODAL_VERBS', 'CONDITIONALS', 'PASSIVE_VOICE', 'REPORTED_SPEECH', 'CONJUNCTIONS', 'QUESTIONS', 'ADJECTIVES_ADVERBS', 'DETERMINERS', 'PHRASAL_VERBS', 'GERUNDS_INFINITIVES', 'NOUNS', 'PRONOUNS', 'WORD_ORDER', 'QUANTIFIERS', 'RELATIVE_CLAUSES', 'SUBJUNCTIVE', 'PARTICIPLES');--> statement-breakpoint
CREATE TABLE "grammar_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_id" uuid,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" "grammar_category" NOT NULL,
	"cerf_level" "cefr_level" NOT NULL,
	"is_published" boolean DEFAULT false,
	"html_content" text NOT NULL,
	"language" text DEFAULT 'ua' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "grammar_rules_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "module" RENAME TO "unit";--> statement-breakpoint
ALTER TABLE "lesson" RENAME COLUMN "module_id" TO "unit_id";--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_module_id_module_id_fk";
--> statement-breakpoint
ALTER TABLE "unit" DROP CONSTRAINT "module_course_id_course_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "type" SET DATA TYPE exercise_type;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "is_published" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "content" jsonb;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "explanation" text;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "order_index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson" ADD COLUMN "type" "lesson_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson" ADD COLUMN "order_index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson" ADD COLUMN "estimated_time" integer;--> statement-breakpoint
ALTER TABLE "unit" ADD COLUMN "order_index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "grammar_rules" ADD CONSTRAINT "grammar_rules_unit_id_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_unit_id_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit" ADD CONSTRAINT "unit_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public"."lesson" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."lesson_type";--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING', 'SPEAKING', 'WRITING', 'PRONUNCIATION', 'MIXED');--> statement-breakpoint
ALTER TABLE "public"."lesson" ALTER COLUMN "type" SET DATA TYPE "public"."lesson_type" USING "type"::"public"."lesson_type";