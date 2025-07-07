import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth, type Auth } from "./auth";
import { authMiddleware } from "./middleware/auth-middleware";

const app = new Hono<{ Variables: Auth }>();

app.use(logger());
app.use(authMiddleware);

const router = app
  .basePath("/api")
  .on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .get("/", (c) => {
    return c.text("Hello Hono!");
  });

export default {
  fetch: app.fetch,
  port: 5000,
};
export type AppType = typeof router;
