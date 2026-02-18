CREATE TABLE "conversation_suggestion" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"topics" jsonb NOT NULL,
	"roleplays" jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversation_suggestion" ADD CONSTRAINT "conversation_suggestion_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
