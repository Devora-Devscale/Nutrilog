import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { schoolRoute } from "./modules/school/school.route";

const app = new Hono()
  .use("/*", cors())
  .get("/", (c) => c.text("Hello Hono!"))
  .route("/schools", schoolRoute);

export type BackendType = typeof app;

serve({
  fetch: app.fetch,
  port: 8000,
});