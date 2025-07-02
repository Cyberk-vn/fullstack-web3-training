"use client";

import React, { useEffect, useState } from "react";
import { SignInWithGoogleButton } from "./auth/_components/SignInWithGoogleButton";
import { useUserStore } from "@/lib/stores";
import { getMyProfile } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import { CyberkLogoIcon } from "@/components/icons";

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
    <div className="w-full flex flex-row justify-between px-[80px] py-8">
      <CyberkLogoIcon />
      <div>
        {!jwt && <SignInWithGoogleButton />}
        {jwt && profile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                {profile.email}
              </button>
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
  );
};
