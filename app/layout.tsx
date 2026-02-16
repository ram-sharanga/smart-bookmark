import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-head",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Bookmark.",
  description: "Your private bookmark manager — synced in real time.",
  openGraph: {
    title: "Bookmark.",
    description: "Your private bookmark manager — synced in real time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
