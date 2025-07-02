"use client";

import { mainnet, sepolia } from "@reown/appkit/networks";
import { createAppKit, SIWXConfig, SIWXMessage } from "@reown/appkit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { projectId, wagmiAdapter } from "@/lib/configs/wagmi-config";
import { queryClient } from "@/lib/configs/query-client-config";
// import { DefaultSIWX } from "@reown/appkit-siwx";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "web3-training",
  description: "Web3 Training",
  url: "https://web3-training.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"], // TODO: Add logo
};

// const siwx: SIWXConfig = {
//   createMessage: async input => {
//     // Implement your logic to create a message
//     console.log("createMessage", input);
//     return "my message" as unknown as SIWXMessage;
//   },
//   addSession: async session => {
//     console.log("addSession", session);
//     // Implement your logic to add a session
//   },
//   revokeSession: async (chainId, address) => {
//     console.log("revokeSession", chainId, address);
//     // Implement your logic to revoke a session
//   },
//   setSessions: async sessions => {
//     console.log("setSessions", sessions);
//     // Implement your logic to set sessions
//   },
//   getSessions: async (chainId, address) => {
//     console.log("getSessions", chainId, address);
//     // Implement your logic to get sessions
//     return [];
//   },
// };
// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, sepolia],
  defaultNetwork:
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? mainnet : sepolia,
  metadata: metadata,
  themeMode: "dark",
  showWallets: false,
  allWallets: "SHOW",
  features: {
    socials: false,
    email: false,
    analytics: false, // Optional - defaults to your Cloud configuration
  },
  // siwx: new DefaultSIWX(), // add this line to enable SIWX
  //   siweConfig: siweConfig,
  themeVariables: {
    //   "--w3m-color-mix": "#00a7aa",
    //   "--w3m-color-mix-strength": 40,
    // "--w3m-font-family": "var(--font-manrope)",
    //   "--w3m-accent": "#00a7aa",
    //   "--w3m-font-size-master": "14px",
    //   "--w3m-border-radius-master": "8px",
    //   "--w3m-z-index": 1000,
    //   "--w3m-qr-color": "#00a7aa",
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
