import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { getFeaturedProjects } from "@/data/projects";

export default function InteriorProjectsBand() {
  const featured = getFeaturedProjects().slice(0, 2);

  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">نمونه‌کارها</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest text-forest">
              پروژه‌هایی که با طراحی داخلی شکل گرفته‌اند
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-forest/68 md:text-lg">
              از آپارتمان‌های مسکونی تا هتل‌ها و ویلاها — هر پروژه روایت واقعی از همکاری تیم معماری داخلی و کارگاه
              ساخت خانه چوب و هنر است.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 text-base text-forest transition-colors hover:text-brick md:text-lg"
            >
              مشاهده همه پروژه‌ها
              <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-2">←</span>
            </Link>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {featured.map((project, index) => (
            <FadeUp key={project.slug} delay={index * 0.08}>
              <Link
                href={`/projects/${project.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-forest/10 bg-forest"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-xs tracking-[0.24em] text-peach/85">{project.category}</p>
                  <h3 className="mt-2 text-2xl font-light tracking-tight text-paper md:text-3xl">{project.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-paper/70">{project.summary}</p>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
