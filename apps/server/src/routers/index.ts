import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { invitesRouter } from "./invites";
import { spaceRouter } from "./spaces";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	spaces: spaceRouter,
	invites: invitesRouter,
};
export type AppRouter = typeof appRouter;
