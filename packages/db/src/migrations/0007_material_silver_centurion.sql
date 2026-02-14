ALTER TABLE "phrase" RENAME TO "vocabulary_phrase";--> statement-breakpoint
ALTER TABLE "vocabulary_phrase" DROP CONSTRAINT "phrase_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "vocabulary_phrase" DROP CONSTRAINT "phrase_learning_path_id_learning_path_id_fk";
--> statement-breakpoint
ALTER TABLE "vocabulary_word" DROP CONSTRAINT "vocabulary_word_learning_path_id_learning_path_id_fk";
--> statement-breakpoint
ALTER TABLE "vocabulary_phrase" ADD COLUMN "source" text DEFAULT 'generated' NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_phrase" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_word" ADD COLUMN "source" text DEFAULT 'generated' NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_word" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabulary_phrase" ADD CONSTRAINT "vocabulary_phrase_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_phrase" DROP COLUMN "learning_path_id";--> statement-breakpoint
ALTER TABLE "vocabulary_word" DROP COLUMN "learning_path_id";--> statement-breakpoint
ALTER TABLE "vocabulary_word" DROP COLUMN "pronunciation";--> statement-breakpoint
ALTER TABLE "vocabulary_word" DROP COLUMN "part_of_speech";--> statement-breakpoint
ALTER TABLE "vocabulary_word" DROP COLUMN "example_sentence";--> statement-breakpoint
ALTER TABLE "vocabulary_word" DROP COLUMN "synonyms";--> statement-breakpoint
ALTER TABLE "vocabulary_word" DROP COLUMN "antonyms";