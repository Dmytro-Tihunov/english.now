CREATE TABLE "pronunciation_attempt" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"item_index" integer NOT NULL,
	"transcript" text NOT NULL,
	"score" integer NOT NULL,
	"word_results" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pronunciation_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"mode" text NOT NULL,
	"difficulty" text NOT NULL,
	"items" jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"summary" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "pronunciation_attempt" ADD CONSTRAINT "pronunciation_attempt_session_id_pronunciation_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."pronunciation_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pronunciation_session" ADD CONSTRAINT "pronunciation_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;