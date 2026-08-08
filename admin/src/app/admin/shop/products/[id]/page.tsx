"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShopProductForm from "@/components/shop/ShopProductForm";
import { shopApi, type ShopProduct } from "@/lib/shop-api";

export default function EditShopProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    shopApi
      .get(params.id)
      .then(setProduct)
      .catch((e) => setError(e instanceof Error ? e.message : "خطا"));
  }, [params.id]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-brick">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-forest/50">
        در حال بارگذاری…
      </div>
    );
  }

  return <ShopProductForm initial={product} />;
}
