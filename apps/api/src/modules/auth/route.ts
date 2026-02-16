import { zValidator } from "@hono/zod-validator";
import { registerSchema } from "@nutrilog/schema";
import { Hono } from "hono";
import { register } from "./service.js";

export const authRoute = new Hono().post(
	"/register",
	zValidator("json", registerSchema),
	async (c) => {
		const request = c.req.valid("json");
		await register(request);
		return c.json({ message: "User registered successfully" }, 201);
	},
);
