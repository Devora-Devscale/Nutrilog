import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { type LoginInput, loginSchema } from "@nutrilog/schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/utils/api";

export const useLoginForm = () => {
	return useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: standardSchemaResolver(loginSchema),
	});
};
export const useLoginMutation = () => {
	const navigate = useNavigate();
	return useMutation({
		mutationKey: ["login"],
		mutationFn: async (data: LoginInput) => {
			const response = await api.auth.login.$post({
				json: data,
			});
			return await response.json();
		},
		onSuccess: (data) => {
			const userString = JSON.stringify(data.user);
			localStorage.setItem("user", userString);
			toast.success("Login Success, redirecting...");
			setTimeout(() => {
				navigate({ to: "/" });
			}, 500);
		},
		onError: () => {
			toast.error("Uppss something wrong, try again later.");
		},
	});
};
