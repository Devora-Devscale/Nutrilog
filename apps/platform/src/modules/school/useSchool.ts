import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

export const useGetSchools = () => {
	return useQuery({
		queryKey: ["schools"],
		queryFn: async () => {
			const res = await api.schools.$get();
			const data = await res.json();
			return data.schools;
		},
	});
};

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

export const useUpdateSchool = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: { name?: string; address?: string };
		}) => {
			const res = await api.schools[":id"].$put({ param: { id }, json: data });
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
	});
};

export const useDeleteSchool = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await api.schools[":id"].$delete({ param: { id } });
			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
	});
};
