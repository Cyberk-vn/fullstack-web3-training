"use client";

import { useUserStore } from "@/lib/store/user.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { jwt } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Wait for hydration (jwt can be undefined initially)
    if (jwt === null) {
      router.replace("/auth");
    } else if (jwt) {
      router.replace("/home");
    }
  }, [jwt, router]);

  // Optionally render a tiny loading state while deciding
  return null;
}
