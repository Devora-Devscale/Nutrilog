import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/utils/api";

export const useGetRecipes = () => {
	return useQuery({
		queryKey: ["recipes"],
		queryFn: async () => {
			const res = await api.recipes.$get();
			const data = await res.json();
			return data.data;
		},
	});
};

export const useCreateRecipe = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			name: string;
			instruction: string;
			ingredients: Array<{ ingredient_id: string; quantity: string }>;
		}) => {
			const res = await api.recipes.$post({ json: data });
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recipes"] });
		},
	});
};

// export const useUpdateRecipe = () => {
// 	const queryClient = useQueryClient();
// 	return useMutation({
// 		mutationFn: async ({
// 			id,
// 			data,
// 		}: {
// 			id: string;
// 			data: {
// 				name?: string;
// 				instruction?: string;
// 				ingredients?: Array<{ ingredient_id: string; quantity: string }>;
// 			};
// 		}) => {
// 			const res = await api.recipes[":id"].$put({
// 				param: { id },
// 				json: data,
// 			});
// 			return await res.json();
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["recipes"] });
// 		},
// 	});
// };

export const useDeleteRecipe = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await api.recipes[":id"].$delete({ param: { id } });
			return await res.json();
		},
		onSuccess: () => {
			toast.success("Recipe deleted!");
			queryClient.invalidateQueries({ queryKey: ["recipes"] });
		},
	});
};
