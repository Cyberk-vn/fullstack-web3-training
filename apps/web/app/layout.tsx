import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import ContextProvider from "@/components/app-kit-provider";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerObj = await headers();
  const cookies = headerObj.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased `}>
        <Providers>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </Providers>
      </body>
    </html>
  );
}
