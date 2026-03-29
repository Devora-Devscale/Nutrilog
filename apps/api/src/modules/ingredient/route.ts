import { zValidator } from "@hono/zod-validator";
import {
	createIngredientSchema,
	updateIngredientSchema,
} from "@nutrilog/schema";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "../../utils/prisma.js";
import { getIngredientById, getIngredients } from "./service.js";

const paramSchema = z.object({
	id: z.uuid(),
});
export const ingredientRoute = new Hono()
	.get("/", async (c) => {
		const ingredients = await getIngredients();
		return c.json({ ingredients });
	})
	.get("/:id", zValidator("param", paramSchema), async (c) => {
		const { id } = c.req.valid("param");
		const ingredient = await getIngredientById(id);
		return c.json({ ingredient });
	})
	.post("/", zValidator("json", createIngredientSchema), async (c) => {
		const data = c.req.valid("json");
		const ingredient = await prisma.ingredient.create({
			data: { ...data, stock: 0 },
		});
		return c.json({ ingredient });
	})
	.delete("/:id", zValidator("param", paramSchema), async (c) => {
		const { id } = c.req.valid("param");
		const ingredient = await prisma.ingredient.delete({
			where: { id },
		});
		return c.json({ ingredient });
	})
	.patch(
		"/:id",
		zValidator("param", paramSchema),
		zValidator("json", updateIngredientSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const data = c.req.valid("json");
			const ingredient = await prisma.ingredient.update({
				where: {
					id,
				},
				data,
			});
			return c.json({ ingredient });
		},
	);
