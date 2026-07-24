import localFont from "next/font/local";

// Persian display + body — Peyda (priority typeface)
export const peyda = localFont({
  src: [
    { path: "../../public/fonts/peyda/PeydaWeb-Thin.woff2", weight: "100", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../../public/fonts/peyda/PeydaWeb-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-peyda",
  display: "swap",
});

// Keep the display face local as well so production builds never depend on
// Google Fonts availability. Peyda Light has the restrained editorial tone
// used throughout the digital brandbook.
export const display = localFont({
  src: "../../public/fonts/peyda/PeydaWeb-Light.woff2",
  variable: "--font-display",
  display: "swap",
});
