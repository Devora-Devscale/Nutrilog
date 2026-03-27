import type {
	IngredientCreateInput,
	IngredientUpdateInput,
} from "../../generated/prisma/models.js";
import { prisma } from "../../utils/prisma.js";

export const getIngredients = async () => {
	return await prisma.ingredient.findMany();
};
export const getIngredientById = async (id: string) => {
	return await prisma.ingredient.findFirstOrThrow({
		where: {
			id,
		},
	});
};
export const createIngredient = async (data: IngredientCreateInput) => {
	return await prisma.ingredient.create({
		data,
	});
};

export const updateIngredient = async (
	id: string,
	data: IngredientUpdateInput,
) => {
	return await prisma.ingredient.update({
		data,
		where: {
			id,
		},
	});
};

export const deleteIngredient = async (id: string) => {
	return await prisma.ingredient.delete({
		where: {
			id,
		},
	});
};
