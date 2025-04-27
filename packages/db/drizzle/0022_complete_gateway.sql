DROP TABLE "user_learning_state" CASCADE;--> statement-breakpoint
DROP TABLE "user_preferences" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "language" text DEFAULT 'ua' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "theme" text DEFAULT 'light' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "current_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "longest_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "unit" ADD COLUMN "image_url" text;