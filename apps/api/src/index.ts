import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { authRoute } from "./modules/auth/route.js";
import type { HonoContext } from "./types.js";

const app = new Hono<HonoContext>()
	.use(logger())
	.use(cors())

	// unprotected route
	.get("/", (c) => {
		return c.json({ message: "Devora - Nutrilog MBG" });
	})
	.route("/auth", authRoute)

	// protected route
	.use(authMiddleware)
	.get("/protected", async (c) => {
		const user = c.get("user");
		return c.json({ message: "protected route", user });
	});

// export type for RPC
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
