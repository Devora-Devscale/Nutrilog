import { serve } from "@hono/node-server";
import { Hono } from "hono";
<<<<<<< HEAD
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
=======

const app = new Hono().get("/", (c) => {
	return c.text("Hello Hono!");
});

export type BackendType = typeof app;

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
>>>>>>> group/main
