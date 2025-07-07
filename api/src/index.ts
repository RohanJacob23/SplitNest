import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

const router = app.basePath("/api").get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  fetch: app.fetch,
  port: 5000,
};
export type AppType = typeof router;
