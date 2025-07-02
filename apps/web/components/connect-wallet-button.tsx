"use client";
import React from "react";
import { useAppKit } from "@reown/appkit/react"; // Try this import
import { useAccount } from "wagmi";
import { Button } from "@workspace/ui/components/button";
import { truncateAddress } from "@/lib/utils";

export const ConnectWalletButton: React.FC = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  return (
    <Button
      className="px-4 py-2 rounded bg-[#262626] text-white cursor-pointer hover:bg-white hover:text-[#171616] h-[34px]"
      onClick={() => open()}
    >
      {!isConnected ? "Connect Wallet" : truncateAddress(address, 5, 4)}
    </Button>
  );
};
