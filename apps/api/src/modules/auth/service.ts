import type { RegisterInput } from "@nutrilog/schema";
import { HTTPException } from "hono/http-exception";
import { hashPassword } from "../../utils/password.js";
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
