"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authCallback } from "@/lib/api/auth";
import { ROUTES } from "@/lib/constants";
interface AuthCallbackParams {
  access_token?: string;
  provider?: string;
}

export default function AuthCallbackPage<AuthCallbackParams>() {
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
  const router = useRouter();
  const handleAuth = async (accessToken: string) => {
    const response = await authCallback(accessToken);
    console.log(response);
    router.push(ROUTES.HOME);
  };
  return <div>Processing authentication...</div>;
}
