import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

export const useGetDashboardStats = () => {
	return useQuery({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const res = await api.dashboard.$get();
			const data = await res.json();
			if (!data.success) throw new Error(data.message);
			return data.data;
		},
	});
};
