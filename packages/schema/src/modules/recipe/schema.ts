import { z } from "zod";

export const createRecipeSchema = z.object({
	name: z.string(),
	instruction: z.string(),
	ingredients: z.array(
		z.object({
			ingredient_id: z.string(),
			quantity: z.string(),
		}),
	),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

export const updateRecipeSchema = createRecipeSchema.extend({
	name: z.string().optional(),
	instruction: z.string().optional(),
	ingredients: z
		.array(
			z.object({
				ingredient_id: z.string(),
				quantity: z.string(),
			}),
		)
		.optional(),
});

export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
