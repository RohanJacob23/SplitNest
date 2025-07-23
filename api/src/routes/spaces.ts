import { Hono } from "hono";
import { db } from "../db";
import type { Auth } from "../auth";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import {
  spaceMembers,
  spacesInsertSchema,
  spacesUpdateSchema,
} from "../db/schema";
import { spaces as spacesDb } from "../db/schema";
import { z } from "zod/v4";
import { and, eq } from "drizzle-orm";

export const spaces = new Hono<{ Variables: Auth }>()
  .get("/", async (c) => {
    const user = c.get("user");

    if (!user)
      throw new HTTPException(401, { message: "Unauthorized request" });

    const result = await db.query.spaceMembers.findMany({
      where: eq(spaceMembers.userId, user.id),
      with: { space: true },
    });

    return c.json(result);
  })
  .post(
    "/",
    zValidator("json", spacesInsertSchema.omit({ ownerId: true })),
    async (c) => {
      const body = c.req.valid("json");

      const user = c.get("user");

      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      const [space] = await db
        .insert(spacesDb)
        .values({
          ...body,
          ownerId: user.id,
        })
        .returning();

      await db
        .insert(spaceMembers)
        .values({ role: "admin", spaceId: space.id, userId: user.id });

      return c.json({ message: "Space created successfully" });
    }
  )
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const user = c.get("user");

      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      const result = await db.query.spaces.findFirst({
        where: eq(spacesDb.id, id),
        with: { owner: true, members: true },
      });

      // is user a member of the space
      const isUserMember = result?.members.some(
        (member) => member.userId === user.id
      );

      // if space not found or user is not a member
      if (!result || !isUserMember)
        throw new HTTPException(404, { message: "Space not found" });

      return c.json(result);
    }
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.coerce.number() })),
    zValidator("json", spacesUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      const user = c.get("user");

      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      await db.update(spacesDb).set(body).where(eq(spacesDb.id, id));

      return c.json({ message: "Space updated successfully" });
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.coerce.number() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const user = c.get("user");

      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      await db.delete(spacesDb).where(eq(spacesDb.id, id));

      return c.json({ message: "Space deleted successfully" });
    }
  )
  .get(
    "/:spaceId/members",
    zValidator("param", z.object({ spaceId: z.coerce.number() })),
    async (c) => {
      const { spaceId } = c.req.valid("param");

      const user = c.get("user");

      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      const result = await db.query.spaceMembers.findMany({
        where: eq(spaceMembers.spaceId, spaceId),
        with: { user: true, space: true },
      });

      return c.json(result);
    }
  )
  .delete(
    "/members/:memberId",
    zValidator("param", z.object({ memberId: z.coerce.number() })),
    async (c) => {
      const { memberId } = c.req.valid("param");

      const user = c.get("user");

      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      await db.delete(spaceMembers).where(eq(spaceMembers.id, memberId));

      return c.json({ message: "Member removed successfully" });
    }
  );
