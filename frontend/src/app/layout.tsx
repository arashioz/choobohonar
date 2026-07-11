import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
import { peyda, display } from "@/lib/fonts";
import { brand } from "@/data/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: `${brand.nameFa} | ${brand.sloganFa}`,
  description:
    "خانه چوب و هنر — برند ممتاز مبلمان و دکوراسیون با میراثی نیم‌قرنی در ساخت چوب. مبلمان، سرویس خواب، دکوراتیو و خدمات معماری داخلی.",
  metadataBase: new URL("https://choobohonar.com"),
  openGraph: {
    title: `${brand.nameFa} | ${brand.sloganFa}`,
    description: "میراثی نیم‌قرنی در ساخت چوب و هنر.",
    type: "website",
    locale: "fa_IR",
    url: "https://choobohonar.com",
    siteName: brand.nameFa,
    images: [{ url: "/images/aknoon-04.jpg", alt: brand.nameFa }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.nameFa} | ${brand.sloganFa}`,
    description: "میراثی نیم‌قرنی در ساخت چوب و هنر.",
    images: ["/images/aknoon-04.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${peyda.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <noscript>
          <style>{`.motion-reveal,.opacity-0{opacity:1 !important;transform:none !important}.hero-loader{display:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
