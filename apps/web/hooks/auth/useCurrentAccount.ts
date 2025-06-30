import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getProfile } from "@/lib/api/profile";
import { Profile } from "@/lib/types/profile";

interface UseCurrentAccountOptions {
  enabled?: boolean;
  staleTime?: number;
  retry?: number;
}

export const useCurrentAccount = (options?: UseCurrentAccountOptions) => {
  return useQuery<Profile>({
    queryKey: ["profile", "me"],
    queryFn: getProfile,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    retry: options?.retry ?? 2,
    enabled: options?.enabled ?? true,
  });
};
