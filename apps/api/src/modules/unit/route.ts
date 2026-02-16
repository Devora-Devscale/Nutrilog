import { zValidator } from "@hono/zod-validator";
import { createUnitSchema, updateUnitSchema } from "@nutrilog/schema";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createunit, deleteUnits, getUnits, updateUnits } from "./service.js";

export const unitRoute = new Hono()
	.post("/", zValidator("json", createUnitSchema), async (c) => {
		const data = c.req.valid("json");
		try {
			const unit = await createunit(data);
			return c.json({ success: true, data: unit }, 201);
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to create unit" });
		}
	})
	.get("/", async (c) => {
		try {
			const units = await getUnits();
			return c.json({ success: true, data: units });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to fetch units" });
		}
	})
	.put("/:id", zValidator("json", updateUnitSchema), async (c) => {
		const id = c.req.param("id");
		const data = c.req.valid("json");
		try {
			const unit = await updateUnits(id, data);
			return c.json({ success: true, data: unit });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to update unit" });
		}
	})
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		try {
			const result = await deleteUnits(id);
			return c.json({ success: true, data: result });
		} catch (error) {
			console.error(error);
			throw new HTTPException(400, { message: "Failed to delete unit" });
		}
	});
