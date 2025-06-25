"use client";

import { ROUTES } from "@/lib/constants";
import { Button } from "@workspace/ui/components/button";

export const SignInWithGoogleButton = () => {
  const handleSignWithGoogle = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const redirectUri = `${window.location.origin}${ROUTES.getAuthCallback("google")}`;
    const scope = "profile email openid";
    const responseType = "token";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = authUrl;
  };

  return <Button onClick={handleSignWithGoogle}>Sign In With Google</Button>;
};
