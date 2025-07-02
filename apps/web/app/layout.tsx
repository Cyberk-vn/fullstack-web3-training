import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { headers } from "next/headers";
import ContextProvider from "@/components/app-kit-provider";
import { Header } from "./header";
import { Footer } from "./footer";

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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased bg-black min-h-[100dvh] flex flex-col`}
      >
        <Providers>
          <ContextProvider cookies={cookies}>
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
            <Footer />
          </ContextProvider>
        </Providers>
      </body>
    </html>
  );
}
