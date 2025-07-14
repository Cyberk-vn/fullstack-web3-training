import { verifySiweMessage } from "@/lib/api/auth";
import { useUserStore } from "@/lib/store/user.store";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useSiweMutation = () => {
  const { setJwt, setProfile } = useUserStore();

  return useMutation({
    mutationFn: verifySiweMessage,
    onSuccess: data => {
      // Store tokens in localStorage
      if (data.jwt) {
        localStorage.setItem("access_token", data.jwt);
        setJwt(data.jwt);
      }
      if (data.jwtRefresh) {
        localStorage.setItem("refresh_token", data.jwtRefresh);
      }

      // Store profile data
      if (data.profile) {
        setProfile(data.profile);
      }

      // Handle new user redirect logic
      if (data.isNewUser) {
        // Redirect to profile setup or show welcome modal
        console.log("New user detected, should redirect to profile setup");
        // You can emit an event or use a navigation function here
      } else {
        // Regular login, redirect to dashboard or home
        console.log("Existing user login successful");
      }
    },
  });
};
