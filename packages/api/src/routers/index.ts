import { protectedProcedure, publicProcedure, router } from "../index";
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
});
export type AppRouter = typeof appRouter;
