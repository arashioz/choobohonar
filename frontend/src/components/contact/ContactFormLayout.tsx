import Link from "next/link";
import Container from "@/components/layout/Container";
import { brand } from "@/data/nav";
import type { ContactFormMeta } from "@/data/contact-forms";

export default function ContactFormLayout({
  form,
  children,
}: {
  form: ContactFormMeta;
  children: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <section className="bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
      <Container>
        <div className="mx-auto max-w-2xl">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-forest/50">
            <Link href="/" className="transition-colors hover:text-forest">
              خانه
            </Link>
            <span>/</span>
            <Link href="/contact" className="transition-colors hover:text-forest">
              ارتباط با ما
            </Link>
            <span>/</span>
            <span className="text-forest">{form.title}</span>
          </nav>

          <div className="mb-8 border-b border-forest/10 pb-6">
            <p className="eyebrow text-brick">{form.eyebrow}</p>
            <h1 className="mt-2 text-2xl font-light tracking-tight text-forest md:text-3xl">{form.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-forest/60">{form.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-forest/45">
              <span>{form.duration}</span>
              {form.steps ? <span>{form.steps} مرحله</span> : null}
              <Link href="/contact" className="text-brick transition-colors hover:text-forest">
                تغییر نوع درخواست
              </Link>
            </div>
          </div>

          <div>{children}</div>

          <p className="mt-10 border-t border-forest/10 pt-6 text-xs text-forest/45">
            سوالی دارید؟ {brand.phone} · {brand.email}
          </p>
        </div>
      </Container>
    </section>
  );
}
