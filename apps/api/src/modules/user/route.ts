import { zValidator } from "@hono/zod-validator";
import { updateUserSchema } from "@nutrilog/schema";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { userService } from "./service.js";

export const userRoute = new Hono()
	.get("/", async (c) => {
		try {
			const data = await userService.getAll();
			return c.json({ success: true, data });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to fetch users" });
		}
	})
	.get("/:id", async (c) => {
		const id = c.req.param("id");
		try {
			const data = await userService.getById(id);
			if (!data) throw new HTTPException(404, { message: "User not found" });
			return c.json({ success: true, data });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to fetch user" });
		}
	})
	.put("/:id", zValidator("json", updateUserSchema), async (c) => {
		const id = c.req.param("id");
		const body = c.req.valid("json");
		try {
			const data = await userService.update(id, body);
			return c.json({ success: true, data });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to update user" });
		}
	})
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		try {
			await userService.delete(id);
			return c.json({
				success: true,
				data: { message: "User deleted successfully" },
			});
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to delete user" });
		}
	});
