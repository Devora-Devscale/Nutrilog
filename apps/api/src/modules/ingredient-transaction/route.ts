import { zValidator } from "@hono/zod-validator";
import {
	createIngredientTransactionSchema,
	updateIngredientTransactionSchema,
} from "@nutrilog/schema";
import { Hono } from "hono";
import z from "zod";
import { prisma } from "../../utils/prisma.js";
import {
	createIngredientTransaction,
	deleteIngredientTransactionById,
	getIngredientTransactionById,
	getIngredientTransactions,
	updateIngredientTransaction,
} from "./service.js";

const paramSchema = z.object({ id: z.uuid() });
export const ingredientTransactionRoute = new Hono()
	.get("/", async (c) => {
		const ingredientTransactions = await getIngredientTransactions();
		return c.json({ ingredientTransactions });
	})
	.get("/:id", zValidator("param", paramSchema), async (c) => {
		const { id } = c.req.valid("param");
		const ingredientTransaction = await getIngredientTransactionById(id);
		return c.json({ ingredientTransaction });
	})
	.post(
		"/",
		zValidator("json", createIngredientTransactionSchema),
		async (c) => {
			const data = c.req.valid("json");
			const ingredient = await prisma.ingredient.findFirstOrThrow({
				where: { id: data.ingredient_id },
			});

			const current_stock = ingredient?.stock + data.in - data.out;
			const ingredientTransaction = await createIngredientTransaction({
				...data,
				current_stock,
			});

			await prisma.ingredient.update({
				where: { id: data.ingredient_id },
				data: { stock: current_stock },
			});

			return c.json({ ingredientTransaction });
		},
	)
	.patch(
		"/:id",
		zValidator("param", paramSchema),
		zValidator("json", updateIngredientTransactionSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const data = c.req.valid("json");
			const ingredientTransaction = await updateIngredientTransaction(id, data);
			return c.json({ ingredientTransaction });
		},
	)

	.delete("/:id", zValidator("param", paramSchema), async (c) => {
		const { id } = c.req.valid("param");
		const ingredientTransaction = await deleteIngredientTransactionById(id);
		return c.json({ ingredientTransaction });
	});
