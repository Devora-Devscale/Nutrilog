import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { registerFESchema } from "@nutrilog/schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { InferRequestType } from "hono";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/utils/api";

type RegisterRequestType = InferRequestType<
	typeof api.auth.register.$post
>["json"];

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
		mutationFn: async (data: RegisterRequestType) => {
			return (await api.auth.register.$post({ json: data })).json();
		},
		onSuccess: () => {
			toast.success("User registered successfully");
			setTimeout(() => {
				navigate({ to: "/login" });
			}, 500);
		},
	});
};
