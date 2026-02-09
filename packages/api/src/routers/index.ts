import { protectedProcedure, publicProcedure, router } from "../index";
import { conversationRouter } from "./conversation";
import { profileRouter } from "./profile";
import { pronunciationRouter } from "./pronunciation";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	pronunciation: pronunciationRouter,
	conversation: conversationRouter,
	profile: profileRouter,
});
export type AppRouter = typeof appRouter;
