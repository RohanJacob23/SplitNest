import { ORPCError } from "@orpc/client";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { invites, spaceMembers } from "@/db/schema";
import { protectedProcedure } from "@/lib/orpc";

const sendInvite = protectedProcedure
	.input(
		z.object({
			email: z.string(),
			spaceId: z.number(),
		}),
	)
	.handler(async ({ input }) => {
		// EDGE CASES:-
		// TODO: check whether the user already exists or not in the db
		// if yes then no need to send invite else send the invite
		// or if that user is already a member of the space then no need to send invite
		// or if there is an already invite to that user then no need to send invite again
		// or if the user is present in user table or not

		const token = crypto.randomUUID();

		await db
			.insert(invites)
			.values({ email: input.email, spaceId: input.spaceId, token });

		return { message: "Invite sent successfully" };
	});

const getAllInvites = protectedProcedure.handler(async ({ context }) => {
	const user = context.session.user;
	const result = await db.query.invites.findMany({
		where: eq(invites.email, user.email),
		with: { space: { with: { owner: true } } },
	});
	return result;
});

const acceptInvite = protectedProcedure
	.input(z.object({ inviteId: z.number() }))
	.handler(async ({ input, context }) => {
		// const result = await db.query.invites.findFirst({
		//     where: eq(invites.token, input.token),
		//     with: { space: { with: { owner: true } } },
		//   });

		const user = context.session.user;

		const invite = await db.query.invites.findFirst({
			where: and(eq(invites.id, input.inviteId), eq(invites.email, user.email)),
		});

		if (!invite)
			throw new ORPCError("NOT_FOUND", { message: "Invite not found" });

		await db
			.update(invites)
			.set({ status: "accepted" })
			.where(eq(invites.id, invite.id));

		await db.insert(spaceMembers).values({
			userId: user.id,
			spaceId: invite.spaceId,
			role: "member",
		});

		await db.delete(invites).where(eq(invites.id, invite.id));

		return { message: "Invite accepted successfully" };
	});

export const declineInvite = protectedProcedure
	.input(z.object({ inviteId: z.number() }))
	.handler(async ({ input }) => {
		await db.delete(invites).where(eq(invites.id, input.inviteId));
		return { message: "Invite declined successfully" };
	});

export const invitesRouter = {
	send: sendInvite,
	get: getAllInvites,
	accept: acceptInvite,
	decline: declineInvite,
};
