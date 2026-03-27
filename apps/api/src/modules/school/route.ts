import { Hono } from "hono";
import { prisma } from "../../utils/prisma.js";

export const schoolRoute = new Hono()
	.get("/", async (c) => {
		const schools = await prisma.school.findMany();
		return c.json({ schools });
	})
	.post("/", async (c) => {
		const body = await c.req.json();
		const school = await prisma.school.create(body);
		return c.json({ school });
	});
