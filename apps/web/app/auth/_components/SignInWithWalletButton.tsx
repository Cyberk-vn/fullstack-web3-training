"use client";

import { SignMessageLoginModal } from "@/components/common/SignMessageLoginModal";
import { useSignMessageLoginModalStoreActions } from "@/components/common/SignMessageLoginModal/store/sign-message-login-modal.store";
import { useAppKit } from "@reown/appkit/react";
import { Button } from "@workspace/ui/components/button";
import { useAccount } from "wagmi";

export const SignInWithWalletButton = () => {
  const { open } = useAppKit();
  const { isConnected } = useAccount();
  const { open: openSignMessageModal } = useSignMessageLoginModalStoreActions();

  const handleSignInWithWallet = () => {
    if (isConnected) {
      console.log("isConnected", isConnected);
      openSignMessageModal();
    } else {
      open();
    }
  };

  return (
    <>
      <Button onClick={handleSignInWithWallet}>Sign In With Wallet</Button>
      <SignMessageLoginModal />
    </>
  );
};
