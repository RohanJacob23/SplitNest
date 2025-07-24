import { Hono } from "hono";
import type { Auth } from "../auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod/v4";
import { invites as invitesDb, spaceMembers } from "../db/schema";
import { HTTPException } from "hono/http-exception";
import { db } from "../db";
import { and, eq } from "drizzle-orm";

export const invites = new Hono<{ Variables: Auth }>()
  .post(
    "/:spaceId",
    zValidator("param", z.object({ spaceId: z.coerce.number() })),
    zValidator("json", z.object({ email: z.email() })),
    async (c) => {
      const { spaceId } = c.req.valid("param");
      const body = c.req.valid("json");

      const user = c.get("user");

      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      // EDGE CASES:-
      // TODO: check whether the user already exists or not in the db
      // if yes then no need to send invite else send the invite
      // or if that user is already a member of the space then no need to send invite
      // or if there is an already invite to that user then no need to send invite again
      // or if the user is present in user table or not

      const token = crypto.randomUUID();

      await db.insert(invitesDb).values({ email: body.email, spaceId, token });

      return c.json({ message: "Invite sent successfully" });
    }
  )
  .get("/", async (c) => {
    const user = c.get("user");

    if (!user)
      throw new HTTPException(401, { message: "Unauthorized request" });

    const result = await db.query.invites.findMany({
      where: eq(invitesDb.email, user.email),
      with: { space: { with: { owner: true } } },
    });
    return c.json(result);
  })
  .post(
    "/:inviteId/accept",
    zValidator("param", z.object({ inviteId: z.coerce.number() })),

    async (c) => {
      const { inviteId } = c.req.valid("param");

      const user = c.get("user");
      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      const invite = await db.query.invites.findFirst({
        where: and(eq(invitesDb.id, inviteId), eq(invitesDb.email, user.email)),
      });

      if (!invite) {
        throw new HTTPException(404, { message: "Invite not found" });
      }

      await db
        .update(invitesDb)
        .set({ status: "accepted" })
        .where(eq(invitesDb.id, invite.id));

      await db.insert(spaceMembers).values({
        userId: user.id,
        spaceId: invite.spaceId,
        role: "member",
      });

      await db.delete(invitesDb).where(eq(invitesDb.id, invite.id));

      return c.json({ message: "Invite accepted successfully" });
    }
  )
  .post(
    "/:inviteId/decline",
    zValidator("param", z.object({ inviteId: z.coerce.number() })),

    async (c) => {
      const { inviteId } = c.req.valid("param");

      const user = c.get("user");
      if (!user)
        throw new HTTPException(401, { message: "Unauthorized request" });

      await db.delete(invitesDb).where(eq(invitesDb.id, inviteId));
      return c.json({ message: "Invite rejected successfully" });
    }
  );
