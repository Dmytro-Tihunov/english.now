CREATE TABLE "conversation_feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text NOT NULL,
	"overall_score" integer,
	"grammar_score" integer,
	"vocabulary_score" integer,
	"fluency_score" integer,
	"pronunciation_score" integer,
	"summary" text,
	"strengths" jsonb,
	"improvements" jsonb,
	"corrections" jsonb,
	"vocabulary_suggestions" jsonb,
	"status" text DEFAULT 'generating' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "learning_path" ADD COLUMN "progress" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_path" ADD COLUMN "progress_message" text;--> statement-breakpoint
ALTER TABLE "conversation_feedback" ADD CONSTRAINT "conversation_feedback_session_id_conversation_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."conversation_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_feedback" ADD CONSTRAINT "conversation_feedback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;