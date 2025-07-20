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
import { eq, or } from "drizzle-orm";

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
        with: { owner: true },
      });

      if (!result) throw new HTTPException(404, { message: "Space not found" });

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
  );
