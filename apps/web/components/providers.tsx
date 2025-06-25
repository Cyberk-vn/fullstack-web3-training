"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ContextProvider from "@/components/app-kit-provider";

interface ProvidersProps {
  children: React.ReactNode;
  cookies?: string | null;
}

export function Providers({ children, cookies = null }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ContextProvider cookies={cookies}>{children}</ContextProvider>
    </NextThemesProvider>
  );
}
