import type { Metadata } from "next";
import { dmSans, notoHebrew, notoArabic } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEITON & Co. — Notary Services",
  description: "Professional digital notary services in 6 languages",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
