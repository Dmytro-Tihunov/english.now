ALTER TABLE "conversation_session" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "pronunciation_attempt" ADD COLUMN "accuracy_score" integer;--> statement-breakpoint
ALTER TABLE "pronunciation_attempt" ADD COLUMN "fluency_score" integer;--> statement-breakpoint
ALTER TABLE "pronunciation_attempt" ADD COLUMN "completeness_score" integer;--> statement-breakpoint
ALTER TABLE "pronunciation_attempt" ADD COLUMN "prosody_score" integer;--> statement-breakpoint
ALTER TABLE "pronunciation_session" ADD COLUMN "deleted_at" timestamp;