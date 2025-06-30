"use client";
import { ConnectWalletButton } from "@/components/common/connect-wallet-button";
import { useCurrentAccount } from "@/hooks/auth/useCurrentAccount";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { data: profile } = useCurrentAccount();

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwtRefresh");
    redirect("/auth");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white flex flex-col items-center rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome {profile?.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            You have successfully signed in with Google.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your authentication is now complete and you're ready to use the
            application. Please connect your wallet to continue.
          </p>
          <div className="mt-4 flex items-center gap-2 justify-center">
            <button
              onClick={handleSignOut}
              className="bg-[#000000] whitespace-nowrap text-white rounded-md hover:bg-[#000000]/80 px-4 py-2"
            >
              Sign Out
            </button>
            <ConnectWalletButton className="w-full bg-blue-500 text-white rounded-md hover:bg-blue-600" />
          </div>
        </div>
      </div>
    </main>
  );
}
