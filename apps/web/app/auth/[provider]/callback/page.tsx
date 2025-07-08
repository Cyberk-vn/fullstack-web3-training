"use client";

import { authCallback } from "@/lib/api/auth/auth";
import { ROUTES } from "@/lib/constants";
import { useUserStore } from "@/lib/store/user.store";
import { Profile } from "@/lib/types/profile";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { provider } = useParams();
  const [error, setError] = useState<string | null>(null);
  const { setJwt, setProfile } = useUserStore();

  const handleCallback = async () => {
    try {
      if (typeof window !== "undefined") {
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const accessToken = params.get("access_token");

        if (accessToken && provider) {
          const response = await authCallback({
            accessToken,
            provider: provider.toString(),
          });

          if (response.jwt) {
            // Store JWT in Zustand store
            setJwt(response.jwt);
            if (response.profile) {
              setProfile(response.profile);
            }

            // Redirect to home page
            router.push(ROUTES.HOME);
          } else {
            setError("Authentication failed. No token received.");
          }
        } else {
          setError("No access token found in the callback URL.");
        }
      }
    } catch (err) {
      console.error("Auth callback error:", err);
      setError("Authentication failed. Please try again.");
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white flex flex-col items-center rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-red-600">
              Authentication Error
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              onClick={() => router.push(ROUTES.AUTH)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white flex flex-col items-center rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Signing you in...
          </h2>
          <div className="mt-4 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    </main>
  );
}
