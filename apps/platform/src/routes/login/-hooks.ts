import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { loginSchema } from "@nutrilog/schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { InferRequestType } from "hono";
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { userAtom } from "@/atoms/user.atom";
import { api } from "@/utils/api";

type LoginRequestType = InferRequestType<typeof api.auth.login.$post>["json"];

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
	const setUser = useSetAtom(userAtom);
	const navigate = useNavigate();
	return useMutation({
		mutationKey: ["login"],
		mutationFn: async (data: LoginRequestType) => {
			return (await api.auth.login.$post({ json: data })).json();
		},
		onSuccess: async (data) => {
			setUser(data.user);
			toast.success(`Login success. Redirecting...`);
			setTimeout(() => {
				navigate({ to: "/" });
			}, 500);
		},
		onError: () => {
			toast.error("Oopss, something happened..");
		},
	});
};
