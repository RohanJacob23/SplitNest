import { relations } from "drizzle-orm";
import {
  invites,
  purchases,
  spaceMembers,
  spaces,
  subscriptionPayments,
  subscriptions,
  user,
} from "./schema";

export const userRelations = relations(user, ({ many }) => ({
  spaces: many(spaceMembers),
  ownedSpaces: many(spaces),
  subscriptions: many(subscriptions),
  purchases: many(purchases),
}));

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  owner: one(user, {
    fields: [spaces.ownerId],
    references: [user.id],
  }),
  members: many(spaceMembers),
  subscriptions: many(subscriptions),
  purchases: many(purchases),
  invites: many(invites),
}));

export const spaceMemberRelations = relations(spaceMembers, ({ one }) => ({
  space: one(spaces, {
    fields: [spaceMembers.spaceId],
    references: [spaces.id],
  }),
  user: one(user, {
    fields: [spaceMembers.userId],
    references: [user.id],
  }),
}));

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    space: one(spaces, {
      fields: [subscriptions.spaceId],
      references: [spaces.id],
    }),
    payer: one(user, {
      fields: [subscriptions.payerId],
      references: [user.id],
    }),
    payments: many(subscriptionPayments),
  })
);

export const subscriptionPaymentsRelations = relations(
  subscriptionPayments,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionPayments.subscriptionId],
      references: [subscriptions.id],
    }),
    paidByUser: one(user, {
      fields: [subscriptionPayments.paidBy],
      references: [user.id],
    }),
  })
);

export const purchasesRelations = relations(purchases, ({ one }) => ({
  space: one(spaces, {
    fields: [purchases.spaceId],
    references: [spaces.id],
  }),
  paidByUser: one(user, {
    fields: [purchases.paidBy],
    references: [user.id],
  }),
}));

export const invitesRelations = relations(invites, ({ one }) => ({
  space: one(spaces, {
    fields: [invites.spaceId],
    references: [spaces.id],
  }),
}));
