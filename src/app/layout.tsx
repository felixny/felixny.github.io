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
    default: "Felix Nampanya · Software Engineer",
    template: "%s · Felix Nampanya",
  },
  description:
    "Boston-based software engineer building Android, web, and backend systems—including Evenmint for household expense splitting and settlement.",
  keywords: [
    "Felix Nampanya",
    "software engineer",
    "Android",
    "Kotlin",
    "React",
    "Next.js",
    "Evenmint",
    "Boston",
  ],
  authors: [{ name: "Felix Nampanya", url: siteUrl }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Felix Nampanya",
    title: "Felix Nampanya · Software Engineer",
    description:
      "Boston-based software engineer building Android, web, and backend systems—including Evenmint for household expense splitting.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Felix Nampanya · Software Engineer",
    description:
      "Android, web & backend—including Evenmint (household expense splitting). Based in Boston.",
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
