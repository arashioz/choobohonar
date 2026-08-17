import type { ShopProduct } from "@/data/products";
import FadeUp from "@/components/motion/FadeUp";
import { getProductEditorialContent } from "@/lib/product-editorial";
import { toFa } from "@/lib/utils";

export default function CommerceProductEditorial({ product }: { product: ShopProduct }) {
  const content = getProductEditorialContent(product);

  return (
    <section className="bg-[#e8ded2] py-24 md:py-32 lg:py-40" aria-labelledby="product-guide-title">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 border-b border-forest/10 pb-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <FadeUp>
            <p className="eyebrow text-brick">Product Guide / {product.id}</p>
            <h2 id="product-guide-title" className="mt-6 text-[clamp(3rem,6vw,6.2rem)] font-extralight leading-[0.88] tracking-tightest text-forest">
              شناخت بهتر،
              <br />
              انتخاب دقیق‌تر
            </h2>
          </FadeUp>
          <FadeUp delay={0.08} className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-9 text-forest/60">{content.intro}</p>
          </FadeUp>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:gap-20">
          <div className="grid gap-px bg-forest/10 sm:grid-cols-3">
            {content.sections.map((section, index) => (
              <article key={section.title} className="flex min-h-[22rem] flex-col bg-[#e8ded2] p-6 md:p-8">
                <span className="font-display text-xl text-brick">0{toFa(index + 1)}</span>
                <h3 className="mt-auto pt-16 text-2xl font-light leading-tight text-forest">{section.title}</h3>
                <p className="mt-5 text-sm leading-8 text-forest/60">{section.body}</p>
              </article>
            ))}
          </div>

          <aside className="bg-forest p-7 text-paper md:p-9">
            <p className="eyebrow text-peach">Product Profile</p>
            <dl className="mt-8 divide-y divide-paper/15 border-y border-paper/15">
              {content.facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[7rem_1fr] gap-4 py-4 text-sm">
                  <dt className="text-paper/45">{fact.label}</dt>
                  <dd className="text-paper/85">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 text-xs leading-7 text-paper/45">
              مشخصات بر اساس اطلاعات فعلی کاتالوگ نمایش داده شده و انتخاب نهایی ویژگی‌ها در سبد خرید ثبت می‌شود.
            </p>
          </aside>
        </div>

        <div className="mt-20 grid gap-10 border-t border-forest/10 pt-14 lg:grid-cols-[0.55fr_1.45fr]">
          <div>
            <p className="eyebrow text-brick">Questions / Answers</p>
            <h3 className="mt-5 text-3xl font-light tracking-tight text-forest md:text-4xl">پرسش‌های پیش از خرید</h3>
          </div>
          <div className="divide-y divide-forest/15 border-y border-forest/15">
            {content.faqs.map((faq, index) => (
              <details key={faq.question} className="group py-6 first:pt-0 last:pb-0">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-base font-medium text-forest marker:content-none md:text-lg">
                  <span><span className="ml-3 font-display text-sm text-brick">0{toFa(index + 1)}</span>{faq.question}</span>
                  <span className="mt-1 text-xl font-light transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pr-10 pt-4 text-sm leading-8 text-forest/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
