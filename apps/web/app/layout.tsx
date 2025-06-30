import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/context/providers";
import { headers } from "next/headers";
import ContextProvider from "@/components/context/appkit-provider";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerObj = await headers();
  const cookies = headerObj.get("cookie");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </Providers>
      </body>
    </html>
  );
}
