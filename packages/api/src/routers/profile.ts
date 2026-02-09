import { db, desc, eq, subscription, userProfile } from "@english.now/db";
import { z } from "zod";
import { protectedProcedure, router } from "../index";

export const profileRouter = router({
	get: protectedProcedure.query(async ({ ctx }) => {
		const [profile] = await db
			.select()
			.from(userProfile)
			.where(eq(userProfile.userId, ctx.session.user.id))
			.limit(1);
		return profile ?? null;
	}),
	getStreakData: protectedProcedure.query(async ({ ctx }) => {
		const [profile] = await db
			.select({
				currentStreak: userProfile.currentStreak,
				longestStreak: userProfile.longestStreak,
				lastActivityAt: userProfile.lastActivityAt,
				timezone: userProfile.timezone,
			})
			.from(userProfile)
			.where(eq(userProfile.userId, ctx.session.user.id))
			.limit(1);
		return profile ?? null;
	}),
	getSubscription: protectedProcedure.query(async ({ ctx }) => {
		const [sub] = await db
			.select()
			.from(subscription)
			.where(eq(subscription.userId, ctx.session.user.id))
			.orderBy(desc(subscription.createdAt))
			.limit(1);
		return sub ?? null;
	}),
	saveOnboarding: protectedProcedure
		.input(
			z.object({
				nativeLanguage: z.string(),
				proficiencyLevel: z.string(),
				dailyGoal: z.number(),
				focusAreas: z.array(z.string()),
				goal: z.string(),
				timezone: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await db
				.update(userProfile)
				.set({
					userId: ctx.session.user.id,
					nativeLanguage: input.nativeLanguage,
					level: input.proficiencyLevel,
					dailyGoal: input.dailyGoal,
					focusAreas: input.focusAreas,
					goal: input.goal,
					timezone: input.timezone,
					isOnboardingCompleted: true,
				})
				.where(eq(userProfile.userId, ctx.session.user.id));

			return { success: true };
		}),
});

export type ProfileRouter = typeof profileRouter;
