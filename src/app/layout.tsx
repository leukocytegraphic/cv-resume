import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreatorOps CV Builder | AI Powered Resume Creator",
  description: "Build an instant, professional CV tailored for high-ticket clients, Web3, and Tech roles. 10 Free Credits on Signup.",
  metadataBase: new URL("https://cv.creatorops.site"),
  openGraph: {
    title: "CreatorOps CV Builder",
    description: "Generate a targeted CV from your X/LinkedIn profile.",
    url: "https://cv.creatorops.site",
    siteName: "CreatorOps CV",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreatorOps CV Builder | AI Powered Resume Creator",
    description: "Build an instant CV from your X/LinkedIn profile. Perfect for tech and Web3.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
