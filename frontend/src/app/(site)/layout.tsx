import SmoothScroll from "@/components/motion/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/components/commerce/cart/CartProvider";
import ScrollProgress from "@/components/motion/ScrollProgress";
import ShopCartDrawer from "@/components/shop/ShopCartDrawer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
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
        <ShopCartDrawer />
      </SmoothScroll>
    </CartProvider>
  );
}
