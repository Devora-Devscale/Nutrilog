import type { LoginInput, RegisterInput } from "@nutrilog/schema";
import { HTTPException } from "hono/http-exception";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { prisma } from "../../utils/prisma.js";

export const register = async (request: RegisterInput) => {
	//check user exist
	const existingUser = await prisma.user.findUnique({
		where: { email: request.email },
	});
	if (existingUser) {
		throw new HTTPException(409, { message: "User already exist" });
	}

	//hash password
	const hashedPassword = await hashPassword(request.password);

	// create user with hashed password
	await prisma.user.create({
		data: {
			email: request.email,
			name: request.name,
			password: hashedPassword,
		},
	});
};
export const login = async (request: LoginInput) => {
	const existingUser = await prisma.user.findUnique({
		where: { email: request.email },
	});
	if (!existingUser) {
		throw new HTTPException(404, { message: "User not found" });
	}

	const isPasswordMatched = await comparePassword(
		request.password,
		existingUser.password,
	);
	if (!isPasswordMatched) {
		throw new HTTPException(401, { message: "Invalid credentials" });
	}

	const { password, created_at, ...user } = existingUser;

	return user;
};
