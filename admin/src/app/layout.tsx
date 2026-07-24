import type { Metadata } from "next";
import { peyda, display } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "برندبوک | خانه چوب و هنر",
  description: "برندبوک دیجیتال خانه چوب و هنر",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${peyda.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <noscript>
          <style>{`.motion-reveal,.opacity-0{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
