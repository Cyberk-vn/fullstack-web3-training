"use client";
import { Button } from "@workspace/ui/components/button";
import { ROUTES } from "@/lib/constants";
const handleLogin = () => {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = `${window.location.origin}${ROUTES.getAuthCallback("google")}`;
  const GOOGLE_RESPONSE_TYPE = "token";
  const GOOGLE_SCOPE = "profile email openid";
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=${GOOGLE_RESPONSE_TYPE}&scope=${GOOGLE_SCOPE}`;
};
export const LoginButton = () => {
  return (
    <Button
      onClick={() => {
        handleLogin();
      }}
      variant="default"
      size="sm"
    >
      Login
    </Button>
  );
};
