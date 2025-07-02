"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authCallback } from "@/lib/api/auth";
import { ROUTES } from "@/lib/constants";
import { useUserStore } from "@/lib/stores/user.store";
import { useShallow } from "zustand/shallow";
export default function AuthCallbackPage() {
  const router = useRouter();
  const { setJwt } = useUserStore();
  const jwt = useUserStore(useShallow(state => state.jwt));
  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    if (typeof window !== "undefined") {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");
      console.log(accessToken);
      handleAuth(accessToken ?? "");
    }
  };

  const handleAuth = async (accessToken: string) => {
    const response = await authCallback(accessToken);
    console.log(response);
    setJwt(response.jwt);
    router.push(ROUTES.HOME);
  };

  return <div>Processing authentication...</div>;
}
