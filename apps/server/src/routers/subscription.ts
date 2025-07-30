import { ORPCError } from "@orpc/client";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import {
	spaceMembers,
	subscriptionInsertSchema,
	subscriptions,
	subscriptionUpdateSchema,
} from "@/db/schema";
import { protectedProcedure } from "@/lib/orpc";

const addSubscription = protectedProcedure
	.input(subscriptionInsertSchema)
	.handler(async ({ input, context }) => {
		const user = context.session.user;
		// await ensureMember(input.spaceId, user.id);

		await db.insert(subscriptions).values(input).returning();

		return { message: "Subscription added successfully" };
	});

// List all subscriptions of user
const getAllSubscriptions = protectedProcedure.handler(
	async ({ input, context }) => {
		const user = context.session.user;
		// await ensureMember(input.spaceId, user.id);

		const spaces = await db.query.spaceMembers.findMany({
			where: eq(spaceMembers.userId, user.id),
			with: { space: true },
		});

		const spaceIds = spaces.map((space) => space.space.id);

		return db.query.subscriptions.findMany({
			where: inArray(subscriptions.spaceId, spaceIds),
			with: { payer: true, space: true },
		});
	},
);

// List all subscriptions in a space
const getSubscriptions = protectedProcedure
	.input(z.object({ spaceId: z.number() }))
	.handler(async ({ input, context }) => {
		const user = context.session.user;
		// await ensureMember(input.spaceId, user.id);

		return db.query.subscriptions.findMany({
			where: eq(subscriptions.spaceId, input.spaceId),
		});
	});

// Get subscription details
const getSubscription = protectedProcedure
	.input(z.object({ subscriptionId: z.number() }))
	.handler(async ({ input, context }) => {
		const user = context.session.user;
		const sub = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.id, input.subscriptionId),
		});
		if (!sub)
			throw new ORPCError("NOT_FOUND", { message: "Subscription not found" });
		// await ensureMember(sub.spaceId, user.id);
		return sub;
	});

// Edit subscription
const updateSubscription = protectedProcedure
	.input(
		z.object({ subscriptionId: z.number(), ...subscriptionUpdateSchema.shape }),
	)
	.handler(async ({ input, context }) => {
		const user = context.session.user;
		const { subscriptionId, ...fields } = input;
		const sub = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.id, subscriptionId),
		});

		if (!sub)
			throw new ORPCError("NOT_FOUND", { message: "Subscription not found" });
		// await ensureMember(sub.spaceId, user.id);

		const [updated] = await db
			.update(subscriptions)
			.set(fields)
			.where(eq(subscriptions.id, subscriptionId))
			.returning();
		return updated;
	});

// Delete subscription
const deleteSubscription = protectedProcedure
	.input(z.object({ subscriptionId: z.number() }))
	.handler(async ({ input, context }) => {
		const user = context.session.user;
		const sub = await db.query.subscriptions.findFirst({
			where: eq(subscriptions.id, input.subscriptionId),
		});
		if (!sub)
			throw new ORPCError("NOT_FOUND", { message: "Subscription not found" });
		// await ensureMember(sub.spaceId, user.id);

		await db
			.delete(subscriptions)
			.where(eq(subscriptions.id, input.subscriptionId));

		return { message: "Subscription deleted successfully" };
	});

export const subscriptionRouter = {
	add: addSubscription,
	listAll: getSubscriptions,
	all: getAllSubscriptions,
	get: getSubscription,
	update: updateSubscription,
	delete: deleteSubscription,
};
