import SmoothScroll from "@/components/motion/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShopCartDrawer from "@/components/shop/ShopCartDrawer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Header />
      <main>{children}</main>
      <Footer />
      <ShopCartDrawer />
    </SmoothScroll>
  );
}
