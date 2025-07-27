import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { spaceMembers, spaces, spacesUpdateSchema } from "@/db/schema";
import { protectedProcedure } from "@/lib/orpc";

const getSpaces = protectedProcedure.handler(async ({ context }) => {
	const user = context.session.user;

	const result = await db.query.spaceMembers.findMany({
		where: eq(spaceMembers.userId, user.id),
		with: { space: true },
	});

	return result;
});

const getSpace = protectedProcedure
	.input(z.object({ id: z.number() }))
	.handler(async ({ input, context }) => {
		const user = context.session.user;

		const result = await db.query.spaces.findFirst({
			where: eq(spaces.id, input.id),
			with: { owner: true, members: true },
		});

		// is user a member of the space
		const isUserMember = result?.members.some(
			(member) => member.userId === user.id,
		);

		// if space not found or user is not a member
		if (!result || !isUserMember)
			throw new ORPCError("NOT_FOUND", { message: "Space not found" });

		return result;
	});

const createSpace = protectedProcedure
	.input(z.object({ name: z.string() }))
	.handler(async ({ input, context }) => {
		const user = context.session.user;

		const [space] = await db
			.insert(spaces)
			.values({
				name: input.name,
				ownerId: user.id,
			})
			.returning();

		await db
			.insert(spaceMembers)
			.values({ role: "admin", spaceId: space.id, userId: user.id });

		return { message: "Space created successfully" };
	});

const updateSpace = protectedProcedure
	.input(z.object({ spaceId: z.number(), ...spacesUpdateSchema.shape }))
	.handler(async ({ input: { spaceId, ...body } }) => {
		await db.update(spaces).set(body).where(eq(spaces.id, spaceId));

		return { message: "Space updated successfully" };
	});

const deleteSpace = protectedProcedure
	.input(z.object({ id: z.number() }))
	.handler(async ({ input }) => {
		await db.delete(spaces).where(eq(spaces.id, input.id));

		return { message: "Space deleted successfully" };
	});

const getSpaceMembers = protectedProcedure
	.input(z.object({ spaceId: z.number() }))
	.handler(async ({ input }) => {
		const result = await db.query.spaceMembers.findMany({
			where: eq(spaceMembers.spaceId, input.spaceId),
			with: { user: true, space: true },
		});

		return result;
	});

const deleteSpaceMember = protectedProcedure
	.input(z.object({ memberId: z.number() }))
	.handler(async ({ input }) => {
		await db.delete(spaceMembers).where(eq(spaceMembers.id, input.memberId));

		return { message: "Member deleted successfully" };
	});

export const spaceRouter = {
	get: { all: getSpaces, one: getSpace },
	create: createSpace,
	delete: deleteSpace,
	update: updateSpace,
	members: {
		get: getSpaceMembers,
		delete: deleteSpaceMember,
	},
};
