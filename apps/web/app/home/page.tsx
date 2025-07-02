"use client";

import { axios } from "@/lib/api";
import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { resetAllStores } from "@/lib/stores/store";

const getMyProfile = async () => {
  const res = await axios.get("profile/me");
  console.log("profile", res);
  return res;
};

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    getMyProfile();
  }, []);

  const handleSignOut = () => {
    resetAllStores();
    router.push(ROUTES.AUTH);
  };

  return (
    <div>
      <h1>Profile Data</h1>
      <Button onClick={getMyProfile} variant="default">
        getMyProfile
      </Button>
      <Button onClick={handleSignOut} variant="destructive">
        Sign Out
      </Button>
      {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}
    </div>
  );
};

export default HomePage;
