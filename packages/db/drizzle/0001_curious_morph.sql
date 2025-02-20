ALTER TABLE "user" drop column "id";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "id" text PRIMARY KEY GENERATED ALWAYS AS (uuid_generate_v4()) STORED NOT NULL;