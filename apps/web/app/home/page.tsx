"use client";

import { getMyProfile } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      getMyProfile()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    router.replace(ROUTES.AUTH);
  };

  return (
    <div>
      <div>HomePage</div>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
}
