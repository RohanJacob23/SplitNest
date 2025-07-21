import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth, type Auth } from "./auth";
import { authMiddleware } from "./middleware/auth-middleware";
import { spaces } from "./routes/spaces";
import { invites } from "./routes/invites";

const app = new Hono<{ Variables: Auth }>();

app.use(logger());
app.use(authMiddleware);

const router = app
  .basePath("/api")
  .on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .route("/spaces", spaces)
  .route("/invites", invites);

export default {
  fetch: app.fetch,
  port: 5000,
};
export type AppType = typeof router;
