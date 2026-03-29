import type {
	IngredientTransactionUncheckedCreateInput,
	IngredientTransactionUncheckedUpdateInput,
} from "../../generated/prisma/models.js";
import { prisma } from "../../utils/prisma.js";

export const getIngredientTransactions = async () => {
	return await prisma.ingredientTransaction.findMany({
		select: {
			ingredient: true,
			id: true,
			in: true,
			out: true,
			current_stock: true,
			ingredient_id: true,
			created_at: true,
		},
	});
};
export const createIngredientTransaction = async (
	data: IngredientTransactionUncheckedCreateInput,
) => {
	return await prisma.ingredientTransaction.create({ data });
};
export const updateIngredientTransaction = async (
	id: string,
	data: IngredientTransactionUncheckedUpdateInput,
) => {
	return await prisma.ingredientTransaction.update({
		where: {
			id,
		},
		data,
	});
};
export const getIngredientTransactionById = async (id: string) => {
	return await prisma.ingredientTransaction.findFirstOrThrow({
		where: { id },
	});
};
export const deleteIngredientTransactionById = async (id: string) => {
	return await prisma.ingredientTransaction.delete({
		where: { id },
	});
};
