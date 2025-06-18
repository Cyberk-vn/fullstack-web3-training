"use client";

import SignInWithGoogleButton from "./_components/SignInWithGoogleButton";

export default function AuthPage() {
  const handleSignWithGoogle = () => {
    console.log("Sign With Google");
    const clientId =
      "1092208322559-rr9rjcat9jh29riu6ea22uq8oe3r6t1n.apps.googleusercontent.com";
    const redirectUri = "http://localhost:3000/auth/google/callback";
    const scope = "profile email openid";
    const responseType = "token";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = authUrl;
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignInWithGoogleButton onClick={handleSignWithGoogle} />
    </div>
  );
}
