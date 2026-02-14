import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { userAtom } from "@/atoms/user.atom";
import { api } from "@/utils/api";

export const useLogoutMutation = () => {
	const setUser = useSetAtom(userAtom);
	const navigate = useNavigate();

	return useMutation({
		mutationKey: ["logout"],
		mutationFn: async () => {
			return (await api.auth.logout.$post()).json();
		},
		onSuccess: () => {
			toast.success("Logging out..");
			setTimeout(() => {
				setUser(null);
				navigate({ to: "/login" });
			}, 500);
		},
	});
};
