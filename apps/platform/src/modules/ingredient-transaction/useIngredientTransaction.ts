import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

export const useGetIngredientTransactions = () => {
	return useQuery({
		queryKey: ["ingredient-transactions"],
		queryFn: async () => {
			const res = await api["ingredient-transactions"].$get();
			return await res.json();
		},
	});
};

export const useCreateIngredientTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			out: number;
			in: number;
			current_stock: number;
			ingredient_id: string;
		}) => {
			const res = await api["ingredient-transactions"].$post({ json: data });
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredient-transactions"] });
		},
	});
};

export const useUpdateIngredientTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: {
				out?: number;
				in?: number;
				current_stock?: number;
				ingredient_id?: string;
			};
		}) => {
			const res = await api["ingredient-transactions"][":id"].$patch({
				param: { id },
				json: data,
			});
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredient-transactions"] });
		},
	});
};

export const useDeleteIngredientTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await api["ingredient-transactions"][":id"].$delete({
				param: { id },
			});
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredient-transactions"] });
		},
	});
};
