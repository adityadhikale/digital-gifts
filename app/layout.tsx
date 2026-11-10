/**
 * Root layout: fonts, metadata and the viewport.
 * Display and UI = Figtree, tag handwriting = Caveat.
 */

import type { Metadata, Viewport } from "next";
import { Figtree, Caveat } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Gifts | Make a gift and send it as a link",
  description:
    "Pick flowers, sweets, a teddy, a letter or photos, add a message, and send the recipient a link to open it.",
  openGraph: {
    title: "Digital Gifts",
    description: "Make a gift and send it as a link.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f5ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
