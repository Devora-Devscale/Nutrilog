import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createAccessToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { prisma } from "../../utils/prisma.js";
import { loginSchema, registerSchema } from "./schema.js";

export const authRoute = new Hono()
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

		// generate access token
		const token = await createAccessToken(existingUser.id);

		// delete unnecessary properties
		const { password, created_at, ...user } = existingUser;

		return c.json({ user: user, token });
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
