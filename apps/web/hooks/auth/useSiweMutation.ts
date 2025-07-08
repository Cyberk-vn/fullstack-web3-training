import { verifySiweMessage } from "@/lib/api/auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useSiweMutation = () => {
  return useMutation({
    mutationFn: verifySiweMessage,
  });
};
