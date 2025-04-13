CREATE TABLE "user_grammar_progress" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_grammar_progress_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"grammar_id" integer NOT NULL,
	"status" "progress_status" DEFAULT 'not_started' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise" RENAME COLUMN "content" TO "items";--> statement-breakpoint
ALTER TABLE "grammar_rules" DROP CONSTRAINT "grammar_rules_unit_id_unit_id_fk";
--> statement-breakpoint
ALTER TABLE "unit" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "unit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "unit" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "unit" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "unit_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "lesson" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "grammar_rules" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "grammar_rules" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "grammar_rules" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "grammar_rules" ALTER COLUMN "unit_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "grammar_rules" ALTER COLUMN "unit_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "estimated_time" integer;--> statement-breakpoint
ALTER TABLE "grammar_rules" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "grammar_rules" ADD COLUMN "level" "cefr_level" NOT NULL;--> statement-breakpoint
ALTER TABLE "user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_grammar_progress" ADD CONSTRAINT "user_grammar_progress_grammar_id_grammar_rules_id_fk" FOREIGN KEY ("grammar_id") REFERENCES "public"."grammar_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_rules" ADD CONSTRAINT "grammar_rules_unit_id_unit_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE cascade ON UPDATE no action;