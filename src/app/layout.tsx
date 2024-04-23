import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";

import { cn } from "@/utils/cn";

const ibm_plex_mono = IBM_Plex_Mono({
  weight: ["300", "400", "500", "700"],
  style: "normal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blinkk",
  description: "The nexxt generation of search engines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-white antialiased",
          ibm_plex_mono.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
