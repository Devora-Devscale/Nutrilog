import z from "zod";

export const updateIngredientTransactionSchema = z.object({
	id: z.uuid(),
	out: z.int(),
	in: z.int(),
	current_stock: z.int(),
	ingredient_id: z.uuid(),
});
export const createIngredientTransactionSchema =
	updateIngredientTransactionSchema.partial({
		id: true,
	});
