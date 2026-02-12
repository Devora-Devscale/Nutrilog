import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import type { JwtPayload } from "../types.js";
import { env } from "../utils/env.js";
import { prisma } from "../utils/prisma.js";

export const authMiddleware = createMiddleware(async (c, next) => {
	// get bearer token
	const bearerToken = c.req.header("Authorization");
	if (!bearerToken) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	// split and get the jwt token
	const token = bearerToken.split(" ")[1];

	try {
		// verify if the token is still valid
		const verified = await verify(token, env().JWT_SECRET, "HS256");

		// casting to get the right payload interface because hono doesnt provide with correct jwtpayload structure
		const payload = verified as unknown as JwtPayload;

		// get corresponding user from the database
		const user = await prisma.user.findUnique({
			where: { id: payload.sub },
			select: {
				id: true,
				email: true,
				role: true,
				school_id: true,
			},
		});

		// attach the user to context
		c.set("user", user);

		await next();
	} catch {
		throw new HTTPException(401, { message: "Invalid token" });
	}
});
