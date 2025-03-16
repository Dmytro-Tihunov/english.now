ALTER TABLE "unit" ALTER COLUMN "course_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "unit_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "grammar_rules" ALTER COLUMN "unit_id" SET DATA TYPE integer;