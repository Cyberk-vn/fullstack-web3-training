"use client";

import { useAppKit } from "@reown/appkit/react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Copy, LogOut, ChevronDown } from "lucide-react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { toast } from "sonner";

interface ConnectWalletButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ConnectWalletButton({
  variant = "default",
  size = "default",
  className,
}: ConnectWalletButtonProps) {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    open();
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard! 📋");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected! 👋");
  };

  if (isConnected && address) {
    const formatBalance = (value: string | undefined) => {
      if (!value) return "0";
      const num = parseFloat(value);
      return num < 0.0001 ? "< 0.0001" : num.toFixed(4);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`${className} flex items-center gap-2`}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
              <span className="text-xs opacity-70">
                {formatBalance(balance?.formatted)} {balance?.symbol || "ETH"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleCopyAddress}
            className="cursor-pointer"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDisconnect}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      variant={variant}
      size={size}
      className={className}
    >
      Connect Wallet
    </Button>
  );
}
