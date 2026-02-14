CREATE TABLE "learning_path" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"level" text NOT NULL,
	"goal" text NOT NULL,
	"focus_areas" jsonb NOT NULL,
	"status" text DEFAULT 'generating' NOT NULL,
	"generated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson" (
	"id" text PRIMARY KEY NOT NULL,
	"unit_id" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"type" text NOT NULL,
	"order" integer NOT NULL,
	"status" text DEFAULT 'locked' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"content" jsonb
);
--> statement-breakpoint
CREATE TABLE "phrase" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"learning_path_id" text NOT NULL,
	"phrase" text NOT NULL,
	"meaning" text NOT NULL,
	"example_usage" text,
	"category" text,
	"level" text NOT NULL,
	"mastery" text DEFAULT 'new' NOT NULL,
	"literal_translation" text,
	"tags" jsonb
);
--> statement-breakpoint
CREATE TABLE "unit" (
	"id" text PRIMARY KEY NOT NULL,
	"learning_path_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"status" text DEFAULT 'locked' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_word" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"learning_path_id" text NOT NULL,
	"word" text NOT NULL,
	"pronunciation" text,
	"part_of_speech" text,
	"definition" text NOT NULL,
	"example_sentence" text,
	"translation" text,
	"level" text NOT NULL,
	"mastery" text DEFAULT 'new' NOT NULL,
	"category" text,
	"tags" jsonb,
	"synonyms" jsonb,
	"antonyms" jsonb
);
--> statement-breakpoint
ALTER TABLE "learning_path" ADD CONSTRAINT "learning_path_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_unit_id_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phrase" ADD CONSTRAINT "phrase_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phrase" ADD CONSTRAINT "phrase_learning_path_id_learning_path_id_fk" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_path"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit" ADD CONSTRAINT "unit_learning_path_id_learning_path_id_fk" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_path"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_word" ADD CONSTRAINT "vocabulary_word_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_word" ADD CONSTRAINT "vocabulary_word_learning_path_id_learning_path_id_fk" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_path"("id") ON DELETE cascade ON UPDATE no action;