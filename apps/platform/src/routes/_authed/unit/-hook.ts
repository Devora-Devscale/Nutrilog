import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	type CreateUnitInput,
	createUnitSchema,
	type UpdateUnitInput,
} from "@nutrilog/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/utils/api";

export const useGetUnitsQuery = () => {
	return useQuery({
		queryKey: ["units"],
		queryFn: async () => {
			const res = await api.units.$get();
			return await res.json();
		},
	});
};

export const useCreateUnitMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateUnitInput) => {
			const res = await api.units.$post({ json: data });

			return await res.json();
		},
		onSuccess: () => {
			toast.success("Unit created!");
			queryClient.invalidateQueries({ queryKey: ["units"] });
		},
		onError: (error) => toast.error(error.message || "Failed to create unit"),
	});
};

export const useUpdateUnitMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: UpdateUnitInput) => {
			const res = await api.units[":id"].$put({
				param: { id: data.id },
				json: data,
			});
			return await res.json();
		},
		onSuccess: () => {
			toast.success("Unit updated!");
			queryClient.invalidateQueries({ queryKey: ["units"] });
		},
		onError: (error) => toast.error(error.message || "Failed to update unit"),
	});
};

export const useDeleteUnitMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await api.units[":id"].$delete({ param: { id } });

			return await res.json();
		},
		onSuccess: () => {
			toast.success("Unit deleted!");
			queryClient.invalidateQueries({ queryKey: ["units"] });
		},
		onError: (error) => toast.error(error.message || "Failed to delete unit"),
	});
};
export const useCreateUnitForm = () => {
	return useForm({
		resolver: standardSchemaResolver(createUnitSchema),
		defaultValues: { name: "" },
	});
};
