import {
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	vector,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const userProfile = pgTable("user_profile", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	embedding: vector("embedding", { dimensions: 1536 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
