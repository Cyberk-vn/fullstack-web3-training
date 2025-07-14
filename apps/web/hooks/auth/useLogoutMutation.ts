import { logout } from "@/lib/api/auth/siwe";
import { useUserStore } from "@/lib/store/user.store";
import { useMutation } from "@tanstack/react-query";

export const useLogoutMutation = () => {
  const { clearUser } = useUserStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Clear user state from Zustand store
      clearUser();
      console.log("User successfully logged out");

      // Optionally redirect to login page
      window.location.href = "/auth";
    },
    onError: error => {
      console.error("Logout failed:", error);
      // Even if logout fails on server, clear local tokens and state
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      clearUser();
    },
  });
};
