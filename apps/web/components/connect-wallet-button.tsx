"use client";

import { Button } from "@workspace/ui/components/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface ConnectWalletButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showAddress?: boolean;
}

export function ConnectWalletButton({
  className,
  variant = "default",
  size = "default",
  showAddress = false,
}: ConnectWalletButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleClick = async () => {
    if (isConnected) {
      setIsDisconnecting(true);
      try {
        await disconnect();
      } finally {
        setIsDisconnecting(false);
      }
    } else {
      await open();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isDisconnecting) return "Disconnecting...";
    if (isConnected) {
      if (showAddress && address) {
        return formatAddress(address);
      }
      return "Disconnect";
    }
    return "Connect Wallet";
  };

  const isLoading = isConnecting || isDisconnecting;

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        isConnected && "bg-green-600 hover:bg-green-700",
        className
      )}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {getButtonText()}
    </Button>
  );
}

// Alternative component that opens the AppKit modal directly
export function AppKitButton({
  className,
  variant = "outline",
  size = "default",
}: Omit<ConnectWalletButtonProps, "showAddress">) {
  const { open } = useAppKit();

  return (
    <Button
      onClick={() => open()}
      variant={variant}
      size={size}
      className={className}
    >
      <svg
        className="mr-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      Open Wallet
    </Button>
  );
}
