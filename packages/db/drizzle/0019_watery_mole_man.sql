ALTER TABLE "user_course_progress" ALTER COLUMN "last_unit_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_course_progress" ALTER COLUMN "last_lesson_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_grammar_progress" ALTER COLUMN "grammar_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_lesson_progress" ALTER COLUMN "lesson_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_unit_progress" ALTER COLUMN "unit_id" SET DATA TYPE uuid;