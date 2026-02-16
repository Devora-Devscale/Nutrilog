import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { RegisterInput } from "@nutrilog/schema";
import { registerFESchema } from "@nutrilog/schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/utils/api";

export const useRegisterForm = () => {
	return useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
			confirm_password: "",
		},
		resolver: standardSchemaResolver(registerFESchema),
	});
};

export const useRegisterMutation = () => {
	const navigate = useNavigate();
	return useMutation({
		mutationKey: ["register"],
		mutationFn: async (data: RegisterInput) => {
			const response = await api.auth.register.$post({ json: data });
			return await response.json();
		},
		onSuccess: () => {
			toast.success("User registered successfully");
			setTimeout(() => {
				navigate({ to: "/login" });
			}, 500);
		},
		onError: () => {
			toast.error("Oops something went wrong, try again later!");
		},
	});
};
