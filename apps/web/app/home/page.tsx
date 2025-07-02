"use client";

import { useEffect, useState } from "react";
import { getMyProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { resetAllStores } from "@/lib/stores";

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch(err => setError(err.message || "Error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = () => {
    resetAllStores();
    router.replace("/auth");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found.</div>;
  console.log("my profile", profile);
  return (
    <div>
      <h1>HomePage</h1>
      <div>Name: {profile.name}</div>
      <div>Email: {profile.email}</div>
      <button
        onClick={handleSignOut}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
