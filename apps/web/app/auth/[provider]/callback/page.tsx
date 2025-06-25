"use client";

import { useEffect, useState } from "react";

export default function CallbackPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");
      setAccessToken(accessToken);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[80svw] space-y-8 p-8 bg-white flex flex-col items-center rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Signing you in...
          </h2>
          <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
            Access token: {accessToken}
          </p>
        </div>
      </div>
    </main>
  );
}
