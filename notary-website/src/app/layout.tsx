import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BEITON & Co. — Notary Services",
  description: "Professional digital notary services in 6 languages",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
