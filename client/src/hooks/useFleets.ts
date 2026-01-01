import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Fleet } from "@/types";

export function useFleets() {
  return useQuery({
    queryKey: ["fleets"],
    queryFn: async () => {
      const response = await api.get<Fleet[]>("/fleets");

      return response.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}
