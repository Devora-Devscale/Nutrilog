import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoute } from "./modules/auth/route.js";
import { recipeRoute } from "./modules/recipe/route.js";
import { schoolRoute } from "./modules/school/school.route.js";
import { unitRoute } from "./modules/unit/route.js";
import { userRoute } from "./modules/user/user.route.js";

const app = new Hono()
	.use(logger())
	.use(
		cors({
			origin: ["http://localhost:3000", "https://nutrilog.kokage.tech"],
			credentials: true,
		}),
	)
	.get("/", (c) => {
		return c.json({ message: "Devora - Nutrilog MBG" });
	})
	.route("/auth", authRoute)
	.route("/units", unitRoute)
	.route("/recipes", recipeRoute)
	.route("/schools", schoolRoute)
	.route("/users", userRoute);

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
