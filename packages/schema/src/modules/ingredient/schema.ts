import z from "zod";

export const updateIngredientSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	minimum: z.int(),
	unit_id: z.uuid(),
});

export const createIngredientSchema = updateIngredientSchema.partial({
	id: true,
});

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
