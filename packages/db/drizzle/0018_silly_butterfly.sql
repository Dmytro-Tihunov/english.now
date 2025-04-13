ALTER TABLE "exercise" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "lesson_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "exercise" ALTER COLUMN "updated_at" SET DEFAULT now();