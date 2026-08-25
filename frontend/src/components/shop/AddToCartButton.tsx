"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { DEFAULT_UNIT_PRICE } from "@/lib/cart";
import { useCart } from "@/components/commerce/cart/CartProvider";

type Props = {
  slug: string;
  name: string;
  image: string;
  productId?: string;
  unitPrice?: number;
  label?: string;
};

export default function AddToCartButton({
  slug,
  name,
  image,
  productId,
  unitPrice = DEFAULT_UNIT_PRICE,
  label = "افزودن به سبد",
}: Props) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  return (
    <Button
      as="button"
      type="button"
      variant="primary"
      showArrow
      onClick={() => {
        addItem({
          productId: numericProductId(productId || slug),
          slug,
          name,
          image,
          unitPrice,
          category: "محصولات",
          currencySymbol: "تومان",
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? "به سبد اضافه شد" : label}
    </Button>
  );
}

function numericProductId(value: string) { const direct = Number(value); return Number.isFinite(direct) && direct > 0 ? direct : [...value].reduce((hash, char) => ((hash * 31 + char.charCodeAt(0)) >>> 0), 7) || 1; }
