import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "@nutrilog/schema";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { createAccessToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { prisma } from "../../utils/prisma.js";

export const authRoute = new Hono()
	.post("/logout", async (c) => {
		deleteCookie(c, "access_token");
		return c.json({ message: "logout successfully" });
	})
	.post("/login", zValidator("json", loginSchema), async (c) => {
		const body = c.req.valid("json");

		// check user exist
		const existingUser = await prisma.user.findUnique({
			where: { email: body.email },
		});
		if (!existingUser) {
			throw new HTTPException(404, { message: "User not found" });
		}

		// check if the password matched
		const isPasswordMatched = await comparePassword(
			body.password,
			existingUser.password,
		);
		if (!isPasswordMatched) {
			throw new HTTPException(401, { message: "Invalid credentials" });
		}

		// delete unnecessary properties
		const { password, created_at, ...user } = existingUser;

		// generate access token
		const token = await createAccessToken(existingUser.id);

		// set cookie
		setCookie(c, "access_token", token, {
			httpOnly: true,
			sameSite: "Lax",
			maxAge: 60 * 60,
		});

		return c.json({ user: user });
	})
	.post("/register", zValidator("json", registerSchema), async (c) => {
		const body = c.req.valid("json");

		//check user exist
		const existingUser = await prisma.user.findUnique({
			where: { email: body.email },
		});
		if (existingUser) {
			throw new HTTPException(409, { message: "User already exist" });
		}

		//hash password
		const hashedPassword = await hashPassword(body.password);

		// create user with hashed password
		await prisma.user.create({
			data: {
				email: body.email,
				name: body.name,
				password: hashedPassword,
			},
		});
		return c.json({ message: "User registered successfully" }, 201);
	});
