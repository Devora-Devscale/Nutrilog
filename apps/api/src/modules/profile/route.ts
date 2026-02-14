import { Hono } from "hono";
import type { HonoContext } from "../../types.js";
import { prisma } from "../../utils/prisma.js";

export const profileRoute = new Hono<HonoContext>().get("/me", async (c) => {
	const userContext = c.get("user");
	const user = await prisma.user.findUnique({
		where: { id: userContext.id },
		select: {
			id: true,
			email: true,
			name: true,
			school_id: true,
			role: true,
		},
	});
	return c.json({ user });
});
