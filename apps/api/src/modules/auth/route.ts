import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "@nutrilog/schema";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { createAccessToken } from "../../utils/jwt.js";
import { login, register } from "./service.js";

export const authRoute = new Hono()
	.post("/register", zValidator("json", registerSchema), async (c) => {
		const request = c.req.valid("json");
		await register(request);
		return c.json({ message: "User registered successfully" }, 201);
	})
	.post("/login", zValidator("json", loginSchema), async (c) => {
		const body = c.req.valid("json");

		const user = await login(body);

		const token = await createAccessToken(user.id);

		setCookie(c, "access_token", token, {
			httpOnly: true,
			sameSite: "Lax",
			maxAge: 60 * 60,
		});

		return c.json({ user: user });
	})
	.post("/logout", async (c) => {
		deleteCookie(c, "access_token");
		return c.json({ message: "logout successfully" });
	});
