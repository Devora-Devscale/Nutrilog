import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

// Load .env from project root
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { authRoute } from "./modules/auth/route.js";
import { dashboardRoute } from "./modules/dashboard/dashboard.route.js";
import { ingredientRoute } from "./modules/ingredient/route.js";
import { ingredientTransactionRoute } from "./modules/ingredient-transaction/route.js";
import { mealPlanRoute } from "./modules/meal-plan/route.js";
import { profileRoute } from "./modules/profile/route.js";
import { recipeRoute } from "./modules/recipe/route.js";
import { schoolRoute } from "./modules/school/route.js";
import { unitRoute } from "./modules/unit/route.js";
import { userRoute } from "./modules/user/route.js";
import type { HonoContext } from "./types.js";

const app = new Hono<HonoContext>()
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
	.use(authMiddleware)
	.route("/units", unitRoute)
	.route("/recipes", recipeRoute)
	.route("/schools", schoolRoute)
	.route("/dashboard", dashboardRoute)
	.route("/users", userRoute)
	.route("/profile", profileRoute)
	.route("/ingredient-transactions", ingredientTransactionRoute)
	.route("/ingredients", ingredientRoute)
	.route("/meal-plans", mealPlanRoute);

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
