import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const conversationSession = pgTable("conversation_session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	scenario: text("scenario").notNull(),
	level: text("level").notNull(), // beginner, intermediate, advanced
	context: jsonb("context").$type<{
		systemPrompt: string;
		scenarioDescription: string;
		goals: string[];
	}>(),
	status: text("status").notNull().default("active"), // active, completed, abandoned
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const conversationMessage = pgTable("conversation_message", {
	id: text("id").primaryKey(),
	sessionId: text("session_id")
		.notNull()
		.references(() => conversationSession.id, { onDelete: "cascade" }),
	role: text("role").notNull(), // user, assistant
	content: text("content").notNull(),
	audioUrl: text("audio_url"), // URL to stored audio if voice message
	corrections:
		jsonb("corrections").$type<
			{
				original: string;
				corrected: string;
				explanation: string;
				type: "grammar" | "vocabulary" | "pronunciation" | "fluency";
			}[]
		>(),
	metadata: jsonb("metadata").$type<{
		transcribedFrom?: "voice" | "text";
		processingTime?: number;
	}>(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ConversationSession = typeof conversationSession.$inferSelect;
export type NewConversationSession = typeof conversationSession.$inferInsert;
export type ConversationMessage = typeof conversationMessage.$inferSelect;
export type NewConversationMessage = typeof conversationMessage.$inferInsert;
