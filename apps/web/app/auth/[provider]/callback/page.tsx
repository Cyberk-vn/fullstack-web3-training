"use client";

import { authCallback } from "@/lib/api/auth";
import { ROUTES } from "@/lib/constants";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { provider } = useParams();

  const signInCallback = async (accessToken: string) => {
    try {
      const res = await authCallback({
        accessToken,
        provider: provider as "google",
      });
      if (res.jwt) {
        router.push(ROUTES.HOME); // Redirect to home
      }
    } catch (error) {
      console.log("Error during sign-in callback:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");

      if (accessToken) {
        signInCallback(accessToken);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Authentication Callback</h1>
      <p className="text-lg">You have successfully logged in!</p>
      <p className="text-sm text-gray-500 mt-2">
        You can close this window or redirect to the main application.
      </p>
    </div>
  );
}
