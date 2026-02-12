import { useQuery } from "@tanstack/react-query";
import { ROLES } from "../constants";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => {
      return ROLES;
    },
  });
};