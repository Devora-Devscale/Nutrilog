import { zValidator } from "@hono/zod-validator";
import { createSchoolSchema, updateSchoolSchema } from "@nutrilog/schema";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { prisma } from "../../utils/prisma.js";
import { schoolService } from "./service.js";

export const schoolRoute = new Hono()
	.get("/", async (c) => {
		try {
			const schools = await schoolService.getAll();
			return c.json({ schools });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to fetch schools" });
		}
	})
	.get("/:id", async (c) => {
		const id = c.req.param("id");
		try {
			const data = await schoolService.getById(id);
			if (!data) throw new HTTPException(404, { message: "School not found" });
			return c.json({ success: true, data });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to fetch school" });
		}
	})
	.post("/", zValidator("json", createSchoolSchema), async (c) => {
		const body = c.req.valid("json");
		try {
			const data = await schoolService.create(body);
			return c.json({ success: true, data }, 201);
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to create school" });
		}
	})
	.put("/:id", zValidator("json", updateSchoolSchema), async (c) => {
		const id = c.req.param("id");
		const body = c.req.valid("json");
		try {
			const data = await schoolService.update(id, body);
			return c.json({ success: true, data });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to update school" });
		}
	})
	.delete(
		"/:id",
		zValidator("param", z.object({ id: z.uuid()})),
		async (c) => {
			const { id } = c.req.valid("param");
			await prisma.school.delete({
				where: { id },
			});
			return c.json({
				success: true,
				data: { message: "School deleted successfully" },
			});
		},
	);
