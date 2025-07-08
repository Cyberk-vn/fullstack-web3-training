import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/api/config";
import { TokenResponse } from "@/lib/types/auth";
import { useUserStore } from "@/lib/store/user.store";
import { useSignMessageLoginModalStoreActions } from "@/components/common/SignMessageLoginModal/store/sign-message-login-modal.store";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

interface SiweVerifyParams {
  message: string;
  signature: string;
}

export const useSiweMutation = () => {
  const { setJwt, setProfile } = useUserStore();
  const { close } = useSignMessageLoginModalStoreActions();
  const router = useRouter();

  return useMutation<TokenResponse, Error, SiweVerifyParams>({
    mutationFn: async ({ message, signature }: SiweVerifyParams) => {
      const response = await axios.post<TokenResponse>("/auth/siwe", {
        message,
        signature,
      });
      return response.data;
    },
    onSuccess: data => {
      if (data.jwt) {
        setJwt(data.jwt);
        if (data.profile) {
          setProfile(data.profile);
        }
        close();
        router.push(ROUTES.HOME);
      }
    },
    onError: error => {
      console.error("SIWE verification failed:", error);
      // Handle error (show toast, etc.)
    },
  });
};
