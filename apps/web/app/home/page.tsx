"use client";

import { ROUTES } from "@/lib/constants";
import { resetAllStores } from "@/lib/stores/store";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleSignOut = () => {
    resetAllStores();
    router.replace(ROUTES.AUTH);
  };

  return (
    <div>
      <div>HomePage </div>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
}
