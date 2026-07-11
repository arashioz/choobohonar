import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import ContactLeadForm from "@/components/contact/ContactLeadForm";
import Container from "@/components/layout/Container";
import { brand } from "@/data/nav";

export const metadata: Metadata = {
  title: "تماس با ما | خانه چوب و هنر",
  description: "برای مشاوره، استعلام قیمت و هماهنگی بازدید از شوروم با خانه چوب و هنر در تماس باشید.",
};

export default function ContactPage() {
  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">خانه</Link>
          <span>/</span>
          <span className="text-forest">تماس با ما</span>
        </nav>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brick">تماس و مشاوره</p>
            <h1 className="mt-6 text-balance text-[clamp(1.875rem,2.8vw,2.75rem)] font-light leading-[1.15] tracking-tightest text-forest">برای انتخاب، سفارش و هماهنگی بازدید همراه شما هستیم.</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-forest/65">اگر برای انتخاب محصول، استعلام قیمت، پروژه معماری داخلی یا بازدید شوروم نیاز به راهنمایی دارید، فرم را تکمیل کنید تا کارشناسان خانه چوب و هنر با شما تماس بگیرند.</p>
            <div className="mt-10 space-y-6 border-t border-forest/10 pt-8 text-forest/75">
              <div><p className="text-sm text-forest/65">تلفن</p><p dir="ltr" className="mt-1 text-lg text-forest">{brand.phone}</p></div>
              <div><p className="text-sm text-forest/65">ایمیل</p><p dir="ltr" className="mt-1 text-lg text-forest">{brand.email}</p></div>
              <div><p className="text-sm text-forest/65">شوروم</p><p className="mt-1 text-lg text-forest">{brand.addressFa}</p><p className="mt-1 text-sm">{brand.showroomHoursFa}</p></div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border border-forest/10 bg-peach/45 p-6 md:p-10">
              <Suspense>
                <ContactLeadForm />
              </Suspense>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
