import { DM_Sans, Noto_Sans_Hebrew, Noto_Sans_Arabic } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const notoHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  weight: ["300", "400", "500"],
  variable: "--font-noto-hebrew",
  display: "swap",
});

export const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500"],
  variable: "--font-noto-arabic",
  display: "swap",
});
