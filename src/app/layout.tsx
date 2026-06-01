import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SkipLink from "@/components/SkipLink";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://felixny.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Felix Product Lab · Felix Nampanya",
    template: "%s · Felix Nampanya",
  },
  description:
    "An app-like portfolio experiment where Felix Nampanya's product work is presented as working React micro-demos.",
  keywords: [
    "Felix Nampanya",
    "software engineer",
    "Android",
    "Kotlin",
    "React",
    "Next.js",
    "Evenmint",
    "PulsePoint",
    "Product Lab",
    "Boston",
  ],
  authors: [{ name: "Felix Nampanya", url: siteUrl }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Felix Nampanya",
    title: "Felix Product Lab · Felix Nampanya",
    description:
      "Working micro-demos for product software, Android systems, automation tooling, and binary data UI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Felix Product Lab · Felix Nampanya",
    description:
      "An app-like portfolio experiment built around interactive project demos.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans`}>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
