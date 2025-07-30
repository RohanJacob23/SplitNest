import {
	boolean,
	date,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

// ----------------------
// Enums
// ----------------------
export const roleEnum = pgEnum("role", ["admin", "member"]);
export const paymentStatusEnum = pgEnum("payment_status", ["paid", "unpaid"]);
export const inviteStatusEnum = pgEnum("invite_status", [
	"pending",
	"accepted",
]);
export const purchaseStatusEnum = pgEnum("purchase_status", [
	"pending",
	"settled",
]);
export const categoryEnum = pgEnum("category", [
	"streaming",
	"utility",
	"software",
	"other",
]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified")
		.$defaultFn(() => false)
		.notNull(),
	image: text("image"),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const spaces = pgTable("spaces", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	ownerId: text("owner_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const spaceMembers = pgTable("space_members", {
	id: serial("id").primaryKey(),
	spaceId: integer("space_id")
		.references(() => spaces.id, {
			onDelete: "cascade",
		})
		.notNull(),
	userId: text("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	role: roleEnum("role").notNull().default("admin"),
	joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
	id: serial("id").primaryKey(),
	spaceId: integer("space_id")
		.references(() => spaces.id, { onDelete: "cascade" })
		.notNull(),
	name: text("name").notNull(),
	amount: integer("amount").notNull(),
	currency: text("currency").default("USD"),
	dueDay: integer("due_day").notNull(), // 1–31
	category: categoryEnum("category").default("other"),
	payerId: text("payer_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	splitMethod: jsonb("split_method")
		.$type<{ type: "equal" | "custom"; percentages: Record<string, number> }>()
		.notNull(), // e.g., {type:"equal"} or {type:"custom", percentages:{user1:50,user2:50}}
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptionPayments = pgTable("subscription_payments", {
	id: serial("id").primaryKey(),
	subscriptionId: integer("subscription_id")
		.references(() => subscriptions.id, { onDelete: "cascade" })
		.notNull(),
	month: date("month").notNull(), // format YYYY-MM-01
	status: paymentStatusEnum("status").default("unpaid"),
	paidBy: text("paid_by")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	markedAt: timestamp("marked_at"),
});

export const purchases = pgTable("purchases", {
	id: serial("id").primaryKey(),
	spaceId: integer("space_id")
		.notNull()
		.references(() => spaces.id, { onDelete: "cascade" }),
	description: text("description").notNull(),
	amount: integer("amount").notNull(),
	currency: text("currency").default("USD"),
	paidBy: text("paid_by")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	purchasedAt: timestamp("purchased_at", { withTimezone: true }).notNull(),
	category: text("category").notNull(),
	splitMethod: jsonb("split_method").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const invites = pgTable("invites", {
	id: serial("id").primaryKey(),
	spaceId: integer("space_id")
		.references(() => spaces.id, { onDelete: "cascade" })
		.notNull(),
	email: text("email").notNull(),
	status: inviteStatusEnum("status").default("pending"),
	token: text("token").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	updatedAt: timestamp("updated_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
});
export const invitesInsertSchema = createInsertSchema(invites);
export const spacesInsertSchema = createInsertSchema(spaces);
export const spacesUpdateSchema = createUpdateSchema(spaces);
export const subscriptionInsertSchema = createInsertSchema(subscriptions);
export const subscriptionUpdateSchema = createUpdateSchema(subscriptions);
