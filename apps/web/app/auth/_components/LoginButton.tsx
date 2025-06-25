"use client";

import { Button } from "@workspace/ui/components/button";
import { CLIENT_ID, REDIRECT_URL } from "../../../lib/constants/auth/auth";

export const LoginButton = () => {
  const signIn = () => {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URL);
    authUrl.searchParams.append("response_type", "token");
    authUrl.searchParams.append("scope", "profile email openid");

    window.location.href = authUrl.toString();
  };
  return (
    <Button
      variant="default"
      size="lg"
      onClick={() => {
        signIn();
      }}
      className="w-full hover:bg-gray-300 bg-gray-200"
    >
      Sign in with Google
    </Button>
  );
};
