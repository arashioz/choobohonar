"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { cartStore, type CartItem } from "@/lib/cart";
import { checkoutApi } from "@/lib/checkout-api";
import { toFa, cn } from "@/lib/utils";

const LocationMapPicker = dynamic(() => import("@/components/shop/LocationMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-forest/10 bg-forest/5 text-sm text-forest/45 sm:h-80">
      در حال بارگذاری نقشه…
    </div>
  ),
});

type Step = "info" | "location" | "pay" | "done";

const SHIPPING_FEE = 350_000;

function formatPrice(n: number) {
  return `${toFa(n.toLocaleString("en-US"))} تومان`;
}

export default function CheckoutPageClient() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("تهران");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [mapNote, setMapNote] = useState("");
  const [point, setPoint] = useState({ lat: 35.6892, lng: 51.389 });
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(cartStore.get());
  }, []);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.qty * i.unitPrice, 0),
    [items],
  );
  const total = subtotal + SHIPPING_FEE;

  async function createOrderAndGoPay() {
    setError("");
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !province.trim()) {
      setError("اطلاعات تماس و آدرس را کامل کنید.");
      setStep("info");
      return;
    }
    if (!point.lat || !point.lng) {
      setError("موقعیت روی نقشه را مشخص کنید.");
      setStep("location");
      return;
    }

    setBusy(true);
    try {
      const order = await checkoutApi.createOrder({
        items,
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        },
        shipping: {
          address: address.trim(),
          city: city.trim(),
          province: province.trim(),
          postalCode: postalCode.trim() || undefined,
          lat: point.lat,
          lng: point.lng,
          mapNote: mapNote.trim() || undefined,
        },
        shippingFee: SHIPPING_FEE,
      });
      setOrderId(order._id);
      setOrderNumber(order.orderNumber);
      setStep("pay");
    } catch (e) {
      setError(e instanceof Error ? e.message : "ثبت سفارش ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  async function pay(simulate: "success" | "fail") {
    if (!orderId) return;
    setBusy(true);
    setError("");
    try {
      const order = await checkoutApi.pay(orderId, simulate);
      cartStore.clear();
      setOrderNumber(order.orderNumber);
      setStep("done");
      router.replace(`/checkout/success?order=${encodeURIComponent(order.orderNumber)}&id=${order._id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "پرداخت ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0 && step !== "done" && !orderId) {
    return (
      <section className="bg-paper pb-24 pt-28 md:pt-36">
        <Container>
          <h1 className="text-3xl font-light text-forest">سبد خالی است</h1>
          <div className="mt-6">
            <Button href="/products" variant="primary" showArrow>
              فروشگاه
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <Container>
        <p className="eyebrow text-brick">تسویه حساب</p>
        <h1 className="mt-4 text-3xl font-light tracking-tightest text-forest md:text-4xl">
          تکمیل خرید
        </h1>

        <ol className="mt-8 flex flex-wrap gap-2 text-xs">
          {[
            { id: "info", label: "اطلاعات" },
            { id: "location", label: "موقعیت و نقشه" },
            { id: "pay", label: "پرداخت آزمایشی" },
          ].map((s) => (
            <li
              key={s.id}
              className={cn(
                "rounded-full border px-3 py-1.5",
                step === s.id
                  ? "border-forest bg-forest text-peach"
                  : "border-forest/15 text-forest/50",
              )}
            >
              {s.label}
            </li>
          ))}
        </ol>

        {error ? (
          <div className="mt-6 rounded-xl border border-brick/20 bg-peach/20 px-4 py-3 text-sm text-brick">
            {error}
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {step === "info" ? (
              <div className="space-y-4 border border-forest/10 bg-white/70 p-6">
                <h2 className="text-lg font-light text-forest">اطلاعات خریدار</h2>
                <Field label="نام و نام خانوادگی">
                  <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="شماره تماس">
                    <input className={inputClass} dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </Field>
                  <Field label="ایمیل (اختیاری)">
                    <input className={inputClass} dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="استان">
                    <input className={inputClass} value={province} onChange={(e) => setProvince(e.target.value)} />
                  </Field>
                  <Field label="شهر">
                    <input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                </div>
                <Field label="آدرس دقیق">
                  <textarea className={inputClass} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
                </Field>
                <Field label="کد پستی (اختیاری)">
                  <input className={inputClass} dir="ltr" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </Field>
                <button
                  type="button"
                  onClick={() => setStep("location")}
                  className="rounded-xl bg-forest px-5 py-3 text-sm text-peach"
                >
                  بعدی: موقعیت روی نقشه
                </button>
              </div>
            ) : null}

            {step === "location" ? (
              <div className="space-y-4 border border-forest/10 bg-white/70 p-6">
                <h2 className="text-lg font-light text-forest">موقعیت تحویل روی نقشه</h2>
                <p className="text-sm text-forest/55">
                  محل دقیق تحویل را روی نقشه مشخص کنید تا ارسال دقیق‌تر شود.
                </p>
                <LocationMapPicker value={point} onChange={setPoint} />
                <Field label="توضیح مسیر / پلاک (اختیاری)">
                  <input className={inputClass} value={mapNote} onChange={(e) => setMapNote(e.target.value)} />
                </Field>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("info")}
                    className="rounded-xl border border-forest/15 px-5 py-3 text-sm text-forest"
                  >
                    قبلی
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void createOrderAndGoPay()}
                    className="rounded-xl bg-forest px-5 py-3 text-sm text-peach disabled:opacity-60"
                  >
                    {busy ? "در حال ثبت سفارش…" : "ثبت سفارش و پرداخت"}
                  </button>
                </div>
              </div>
            ) : null}

            {step === "pay" ? (
              <div className="space-y-4 border border-forest/10 bg-white/70 p-6">
                <h2 className="text-lg font-light text-forest">پرداخت آزمایشی</h2>
                <p className="text-sm text-forest/60">
                  سفارش <span dir="ltr">{orderNumber}</span> ثبت شد. این درگاه فقط برای تست است و پول واقعی
                  کم نمی‌شود.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void pay("success")}
                    className="rounded-xl bg-forest px-5 py-3 text-sm text-peach disabled:opacity-60"
                  >
                    {busy ? "…" : "پرداخت موفق (Mock)"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void pay("fail")}
                    className="rounded-xl border border-brick/25 px-5 py-3 text-sm text-brick disabled:opacity-60"
                  >
                    شبیه‌سازی شکست پرداخت
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 border border-forest/10 bg-white/80 p-6">
              <p className="text-sm text-forest/55">خلاصه سفارش</p>
              <ul className="mt-4 space-y-2 text-sm text-forest/75">
                {items.map((item) => (
                  <li key={item.slug} className="flex justify-between gap-3">
                    <span className="truncate">
                      {item.name} × {toFa(item.qty)}
                    </span>
                    <span className="shrink-0">{formatPrice(item.qty * item.unitPrice)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 border-t border-forest/10 pt-4 text-sm">
                <div className="flex justify-between text-forest/60">
                  <span>جمع جزء</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-forest/60">
                  <span>ارسال</span>
                  <span>{formatPrice(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between text-base text-forest">
                  <span>مبلغ نهایی</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-forest/55">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full border-b border-forest/20 bg-transparent py-2.5 text-sm text-forest outline-none focus:border-forest";
