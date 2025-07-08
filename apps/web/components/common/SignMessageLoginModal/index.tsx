import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  useSignMessageLoginModalStore,
  useSignMessageLoginModalStoreActions,
} from "./store/sign-message-login-modal.store";
import { useShallow } from "zustand/react/shallow";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { Address } from "viem";
import { useSiweMutation } from "@/hooks/auth/useSiweMutation";
import { useNonceQuery } from "@/hooks/auth/useNonceQuery";
import { UseQueryOptions } from "@tanstack/react-query";

export const SignMessageLoginModal = () => {
  const [isOpen] = useSignMessageLoginModalStore(
    useShallow(state => [state.isOpen])
  );
  const { close } = useSignMessageLoginModalStoreActions();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: nonce, isLoading: isLoadingNonce } = useNonceQuery(
    address as Address,
    {
      enabled: !!address && isOpen,
    } as UseQueryOptions
  );
  const { mutate: verifySiweMessageMutation, isPending } = useSiweMutation();

  console.log("======nonce", nonce);

  const createSiweMessage = async (address: Address, statement: string) => {
    const scheme = window.location.protocol.slice(0, -1);
    const domain = window.location.host;
    const origin = window.location.origin;
    const message = new SiweMessage({
      scheme,
      domain,
      address,
      statement,
      uri: origin,
      version: "1",
      chainId: 11155111,
      nonce: nonce,
    });
    return message.prepareMessage();
  };

  const handleSignMessage = async () => {
    if (!address) {
      console.log("No address");
      return;
    }
    const message = await createSiweMessage(address, "Sign in to the app");
    const signature = await signMessageAsync({ message });
    await verifySiweMessageMutation({ message, signature });
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Message</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Sign in to the app with your wallet
        </DialogDescription>
        <Button
          onClick={handleSignMessage}
          disabled={isPending || isLoadingNonce}
        >
          {isPending
            ? "Signing..."
            : isLoadingNonce
              ? "Loading..."
              : "Sign Message"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
