import type { UpdateIngredientInput } from "@nutrilog/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

export const useGetIngredients = () => {
	return useQuery({
		queryKey: ["ingredients"],
		queryFn: async () => {
			const res = await api.ingredients.$get();
			return await res.json();
		},
	});
};

export const useCreateIngredient = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			name: string;
			minimum: number;
			stock: number;
			unit_id: string;
		}) => {
			const res = await api.ingredients.$post({ json: data });
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});
};

export const useUpdateIngredient = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateIngredientInput;
		}) => {
			const res = await api.ingredients[":id"].$patch({
				param: { id },
				json: data,
			});
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});
};

export const useDeleteIngredient = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await api.ingredients[":id"].$delete({ param: { id } });
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
	});
};
