import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/utils/api";

export const useGetMealPlansQuery = () => {
	return useQuery({
		queryKey: ["meal-plans"],
		queryFn: async () => {
			const res = await api["meal-plans"].$get();
			return await res.json();
		},
	});
};

export const useDeleteMealPlanMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await api["meal-plans"][":id"].$delete({ param: { id } });
			return await res.json();
		},
		onSuccess: () => {
			toast.success("Meal plan deleted!");
			queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
		},
		onError: (error) =>
			toast.error(error.message || "Failed to delete meal plan"),
	});
};
