import type { CreateRecipeInput, UpdateRecipeInput } from "@nutrilog/schema";
import { prisma } from "../../utils/prisma.js";

export async function createRecipe(data: CreateRecipeInput) {
	return prisma.recipe.create({
		data: {
			name: data.name,
			instruction: data.instruction,
			ingredientRecipes: {
				create: data.ingredients.map(
					(ing: { ingredient_id: string; quantity: string }) => ({
						ingredient_id: ing.ingredient_id,
						quantity: Number(ing.quantity),
					}),
				),
			},
		},
		include: {
			ingredientRecipes: {
				include: {
					ingredient: true,
				},
			},
		},
	});
}

export async function getRecipes(id?: string) {
	return prisma.recipe.findMany({
		where: id ? { id } : undefined,
	});
}

export async function updateRecipes(id: string, data: UpdateRecipeInput) {
	// Jika ada ingredients, hapus yang lama dan buat yang baru
	if (data.ingredients) {
		await prisma.ingredientRecipe.deleteMany({
			where: { recipe_id: id },
		});
	}

	return prisma.recipe.update({
		where: { id },
		data: {
			name: data.name,
			instruction: data.instruction,
			...(data.ingredients && {
				ingredientRecipes: {
					create: data.ingredients.map(
						(ing: { ingredient_id: string; quantity: string }) => ({
							ingredient_id: ing.ingredient_id,
							quantity: Number(ing.quantity),
						}),
					),
				},
			}),
		},
		include: {
			ingredientRecipes: {
				include: {
					ingredient: true,
				},
			},
		},
	});
}

export async function deleteRecipes(id: string) {
	return prisma.recipe.delete({
		where: { id },
		select: {
			id: true,
		},
	});
}
