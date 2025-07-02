"use client";

import React, { useEffect, useState } from "react";
import { SignInWithGoogleButton } from "@/components/sign-in-with-google-button";
import { useUserStore } from "@/lib/stores";
import { getMyProfile } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import { CyberkLogoIcon } from "@/components/icons";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Button } from "@workspace/ui/components/button";
import { HeaderBackground } from "@/components/images/header-bg";

export const Header = () => {
  const { jwt, setJwt } = useUserStore();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!jwt) {
      setProfile(null);
      return;
    }
    getMyProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [jwt]);

  const handleSignOut = () => {
    setJwt("");
    setProfile(null);
  };

  return (
    <div className="w-full relative overflow-hidden">
      <HeaderBackground className="absolute left-1/2 -top-[55px] -translate-x-1/2 z-0 pointer-events-none scale-100" />
      <div className="flex flex-row justify-between px-[18px] py-[14px] sm:px-[80px] sm:py-8 items-center z-10 relative">
        <CyberkLogoIcon />
        <div className="flex flex-row gap-4 items-center">
          <ConnectWalletButton />
          {!jwt && <SignInWithGoogleButton />}
          {jwt && profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="px-4 py-2 bg-[#262626] text-white rounded cursor-pointer h-[34px] hover:bg-white hover:text-[#171616]">
                  {profile.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};
