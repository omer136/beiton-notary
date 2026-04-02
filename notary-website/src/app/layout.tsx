import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import LanguageTracker from "@/components/LanguageTracker";
import RouteChangeTracker from "@/components/RouteChangeTracker";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
    <html lang="he">
      <head>
        {/* Consent Mode V2 defaults — BEFORE GTM, checks localStorage first */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var savedConsent = null;
try { savedConsent = localStorage.getItem('beiton_consent'); } catch(e) {}
if (savedConsent === 'granted') {
  gtag('consent', 'default', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
} else {
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
  });
}`}
        </Script>
        {/* GTM — single source for GA4, Meta Pixel, Google Ads */}
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];
w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <LanguageTracker />
        <RouteChangeTracker />
        {children}
      </body>
    </html>
  );
}
