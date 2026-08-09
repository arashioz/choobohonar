"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

function SuccessInner() {
  const params = useSearchParams();
  const order = params.get("order");

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-peach">
            ✓
          </div>
          <h1 className="text-3xl font-light tracking-tightest text-forest">پرداخت آزمایشی موفق بود</h1>
          <p className="mt-3 text-forest/60">
            سفارش شما ثبت شد
            {order ? (
              <>
                {" "}
                — شماره سفارش: <span dir="ltr">{order}</span>
              </>
            ) : null}
          </p>
          <p className="mt-2 text-sm text-forest/45">
            فاکتور فروش در پنل مدیریت تولید شده و وضعیت سفارش از آنجا قابل پیگیری است.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/products" variant="primary" showArrow>
              بازگشت به فروشگاه
            </Button>
            <Button href="/" variant="secondary">
              صفحه اصلی
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
