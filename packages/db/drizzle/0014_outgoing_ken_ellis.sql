ALTER TABLE "user_course_progress" RENAME COLUMN "last_module_id" TO "last_unit_id";--> statement-breakpoint
ALTER TABLE "user_learning_state" DROP CONSTRAINT "user_learning_state_last_unit_id_unit_id_fk";
--> statement-breakpoint
ALTER TABLE "user_learning_state" DROP CONSTRAINT "user_learning_state_last_lesson_id_lesson_id_fk";
--> statement-breakpoint
ALTER TABLE "user_course_progress" DROP CONSTRAINT "user_course_progress_last_module_id_unit_id_fk";
--> statement-breakpoint
ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_last_unit_id_unit_id_fk" FOREIGN KEY ("last_unit_id") REFERENCES "public"."unit"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_learning_state" DROP COLUMN "last_unit_id";--> statement-breakpoint
ALTER TABLE "user_learning_state" DROP COLUMN "last_lesson_id";