"use client";

import { useEffect } from "react";

export default function AuthCallbackPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const token = url.split("token=")[1];
      console.log(token);
    }
  }, []);

  return <div>AuthCallbackPage</div>;
}
