"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { cartStore, DEFAULT_UNIT_PRICE } from "@/lib/cart";

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

  return (
    <Button
      as="button"
      type="button"
      variant="primary"
      showArrow
      onClick={() => {
        cartStore.add({
          productId,
          slug,
          name,
          image,
          unitPrice,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? "به سبد اضافه شد" : label}
    </Button>
  );
}
