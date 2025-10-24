import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { PageViewCounter, SimpleAnalytics } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Felix Nampanya - Software Engineer Portfolio",
  description: "Software Engineer specializing in Android, Frontend, and Backend development. Experience with Kotlin, React, Node.js, and modern web technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            {children}
            <PageViewCounter />
            <SimpleAnalytics />
          </body>
        </html>
  );
}
