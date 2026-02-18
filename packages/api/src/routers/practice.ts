import type { PronunciationSessionSummary } from "@english.now/db";
import {
	and,
	conversationSession,
	db,
	desc,
	eq,
	isNull,
	pronunciationSession,
} from "@english.now/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

export const practiceRouter = router({
	deleteSession: protectedProcedure
		.input(
			z.object({
				sessionId: z.string(),
				type: z.enum(["conversation", "pronunciation"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const now = new Date();

			if (input.type === "conversation") {
				const result = await db
					.update(conversationSession)
					.set({ deletedAt: now })
					.where(
						and(
							eq(conversationSession.id, input.sessionId),
							eq(conversationSession.userId, userId),
						),
					)
					.returning({ id: conversationSession.id });

				if (result.length === 0) {
					throw new Error("Session not found");
				}
			} else {
				const result = await db
					.update(pronunciationSession)
					.set({ deletedAt: now })
					.where(
						and(
							eq(pronunciationSession.id, input.sessionId),
							eq(pronunciationSession.userId, userId),
						),
					)
					.returning({ id: pronunciationSession.id });

				if (result.length === 0) {
					throw new Error("Session not found");
				}
			}

			return { success: true };
		}),

	getRecentSessions: protectedProcedure
		.input(
			z
				.object({
					limit: z.number().min(1).max(50).default(20),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const limit = input?.limit ?? 20;

			// Fetch both session types in parallel
			const [pronunciationSessions, conversationSessions] = await Promise.all([
				db
					.select({
						id: pronunciationSession.id,
						mode: pronunciationSession.mode,
						difficulty: pronunciationSession.difficulty,
						status: pronunciationSession.status,
						summary: pronunciationSession.summary,
						createdAt: pronunciationSession.createdAt,
						completedAt: pronunciationSession.completedAt,
					})
					.from(pronunciationSession)
					.where(
						and(
							eq(pronunciationSession.userId, userId),
							isNull(pronunciationSession.deletedAt),
						),
					)
					.orderBy(desc(pronunciationSession.createdAt))
					.limit(limit),
				db
					.select({
						id: conversationSession.id,
						scenario: conversationSession.scenario,
						level: conversationSession.level,
						status: conversationSession.status,
						createdAt: conversationSession.createdAt,
					})
					.from(conversationSession)
					.where(
						and(
							eq(conversationSession.userId, userId),
							isNull(conversationSession.deletedAt),
						),
					)
					.orderBy(desc(conversationSession.createdAt))
					.limit(limit),
			]);

			// Map to unified shape
			const unified = [
				...pronunciationSessions.map((s) => ({
					id: s.id,
					type: "pronunciation" as const,
					title: s.mode === "read-aloud" ? "Read Aloud" : "Tongue Twisters",
					mode: s.mode,
					status: s.status,
					score:
						(s.summary as PronunciationSessionSummary | null)?.averageScore ??
						null,
					createdAt: s.createdAt,
				})),
				...conversationSessions.map((s) => ({
					id: s.id,
					type: "conversation" as const,
					title: s.scenario,
					mode: null,
					status: s.status,
					score: null,
					createdAt: s.createdAt,
				})),
			];

			// Sort by date descending and take the limit
			unified.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

			return unified.slice(0, limit);
		}),
});
