import type { Metadata } from "next";
import ProductsLanding from "@/components/commerce/ProductsLanding";

export const metadata: Metadata = {
  title: "فروشگاه محصولات | خانه چوب و هنر",
  description: "مبلمان، کالای خواب، روشنایی و اشیای خانه؛ مجموعه کامل محصولات خانه چوب و هنر.",
};

export default function ProductsIndexPage() {
  return <ProductsLanding />;
}
