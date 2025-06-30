"use client";

import { authCallback } from "@/lib/api/auth";
import { ROUTES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { provider } = useParams();

  const handleCallback = async () => {
    if (typeof window !== "undefined") {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");
      if (accessToken) {
        const response = await authCallback({
          accessToken,
          provider: provider!.toString(),
        });

        if (response.jwt) {
          router.push(ROUTES.HOME);
        }
      }
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div>
      <h1>Auth Callback</h1>
      <div>
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
}
