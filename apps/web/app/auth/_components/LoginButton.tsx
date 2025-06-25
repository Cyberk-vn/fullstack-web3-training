"use client";

import { Button } from "@workspace/ui/components/button";
import { getClientId, getRedirectUrl, SCOPE } from "../../../lib/constants/auth/auth";

export const LoginButton = () => {
  const signInWithGoogle = () => {
    const clientId = getClientId();
    const redirectUri = getRedirectUrl("google");
    const scope = SCOPE;
    const responseType = "token";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    
    window.location.href = authUrl;
  };

  return (
    <Button
      variant="default"
      size="lg"
      onClick={signInWithGoogle}
      className="w-full hover:bg-blue-600 bg-blue-500 text-white"
    >
      Sign in with Google
    </Button>
  );
};
