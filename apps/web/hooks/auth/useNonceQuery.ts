import { getNonce } from "@/lib/api/auth";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Address } from "viem";

export const useNonceQuery = (address: Address, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ["nonce", address],
    queryFn: () => getNonce(address),
    ...options,
    select: (data: unknown) => (data as { nonce: string })?.nonce,
    staleTime: 5000,
  });
};
