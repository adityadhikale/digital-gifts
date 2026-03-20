/**
 * Root layout component for the Digital Gifts application.
 * Configures global fonts (Playfair Display, DM Sans, Dancing Script)
 * and sets up metadata for SEO.
 */

import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

/* Playfair Display - Elegant serif font for headings */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

/* DM Sans - Modern sans-serif for body text */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

/* Dancing Script - Handwritten style for romantic accents */
const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

/** Site metadata for SEO and social sharing */
export const metadata: Metadata = {
  title: "Digital Gifts — Send love, beautifully",
  description:
    "Build a personal digital gift — flowers, sweet treats, memories and more — and share it with someone you love.",
};

/**
 * Root layout wrapper - applies fonts to the entire application.
 * Font CSS variables are available globally for use in components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${dancing.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
