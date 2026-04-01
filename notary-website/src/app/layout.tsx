import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LanguageTracker from "@/components/LanguageTracker";
import RouteChangeTracker from "@/components/RouteChangeTracker";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";

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
      <head>
        {/* Consent Mode V2 defaults — BEFORE GTM, checks localStorage first */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
var savedConsent=null;
try{savedConsent=localStorage.getItem('beiton_consent');}catch(e){}
if(savedConsent==='granted'){
gtag('consent','default',{
'ad_storage':'granted',
'ad_user_data':'granted',
'ad_personalization':'granted',
'analytics_storage':'granted'
});
}else{
gtag('consent','default',{
'ad_storage':'denied',
'ad_user_data':'denied',
'ad_personalization':'denied',
'analytics_storage':'denied',
'wait_for_update':500
});
}`}
        </Script>
        {/* GTM */}
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
        {/* GA4 gtag — direct fallback alongside GTM */}
        {GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}',{send_page_view:false});`}
            </Script>
          </>
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
