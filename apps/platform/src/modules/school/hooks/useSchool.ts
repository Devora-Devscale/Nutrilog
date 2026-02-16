import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

export const useCreateSchool = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newSchool: { name: string; address: string }) => {
			const res = await api.schools.$post({ json: newSchool });
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
	});
};
