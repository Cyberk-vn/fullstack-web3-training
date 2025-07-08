"use client";

import { useUserStore } from "@/lib/store/user.store";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "./_components/LoginButton";
import { SignInWithWalletButton } from "./_components/SignInWithWalletButton";

export default function AuthPage() {
  const { jwt } = useUserStore();

  useEffect(() => {
    if (jwt) {
      redirect("/home");
    }
  }, [jwt]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid grid-cols-1 space-y-4 bg-white p-8 rounded-lg shadow-lg">
        <p className="text-center text-2xl font-bold">Login</p>
        <LoginButton />
        <SignInWithWalletButton />
      </div>
    </main>
  );
}
