import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { peyda } from "@/lib/fonts";
import { brand, campaign } from "@/data/campaign";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/motion/ScrollProgress";
import { brandAssets, landingPublicPath } from "@/lib/brand-assets";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://52.choobohonar.com";

export const metadata: Metadata = {
  title: `${campaign.slogan} | ${brand.nameFa}`,
  description: `${campaign.definition}. ${campaign.definitionLong}`,
  metadataBase: new URL(site),
  icons: { icon: brandAssets.logo.black },
  openGraph: {
    title: campaign.slogan,
    description: campaign.definition,
    type: "website",
    locale: "fa_IR",
    url: site,
    siteName: brand.nameFa,
    images: [{ url: landingPublicPath("/images/heritage.jpg"), alt: campaign.slogan }],
  },
  twitter: {
    card: "summary_large_image",
    title: campaign.slogan,
    description: campaign.definition,
    images: [landingPublicPath("/images/heritage.jpg")],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={peyda.variable}>
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WGMHH25W');`}
        </Script>
      </head>
      <body className="font-sans antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WGMHH25W"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <noscript>
          <style>{`html.is-intro,html.is-intro body{overflow:auto!important;height:auto;touch-action:auto}.motion-reveal,.motion-clip{opacity:1 !important;transform:none !important;clip-path:none !important}.hero-loader{display:none !important}`}</style>
        </noscript>
        <SmoothScroll>
          <a className="skip-link" href="#main-content">
            رفتن به محتوای اصلی
          </a>
          <ScrollProgress />
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
