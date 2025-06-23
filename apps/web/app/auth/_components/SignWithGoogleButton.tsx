"use client";

import { Button } from "@workspace/ui/components/button";

export const SignInWithGoogleButton = () => {
  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login initiated");
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = "profile email openid";
    const responseType = "token";
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    window.location.href = url;
  };

  return <Button onClick={handleGoogleLogin}>Login with Google</Button>;
};
