import type { UpdateSchoolInput } from "@nutrilog/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
			toast.success("School created!");
		},
		onError: () => toast.error("Failed to create school"),
	});
};

export const useUpdateSchool = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: UpdateSchoolInput) => {
			const res = await api.schools[":id"].$put({ param: { id }, json: data });
			return await res.json();
		},
		onSuccess: () => {
			toast.success("School updated!");
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
	});
};

export const useDeleteSchool = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const res = await api.schools[":id"].$delete({ param: { id } });
			return await res.json();
		},
		onSuccess: () => {
			toast.success("School deleted!");
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
		onError: () => {
			toast.error("Upps something happened, try again later!");
		},
	});
};
