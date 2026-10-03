import Link from "next/link";
import Container from "@/components/layout/Container";
import { HOME_PAGE_DEFAULTS, type HomePageContent } from "@/lib/home-page-content";

type FeaturedProjectsIntroProps = {
  showAllLink?: boolean;
  copy?: Pick<HomePageContent["projects"], "eyebrow" | "title" | "body" | "linkLabel">;
};

export default function FeaturedProjectsIntro({ showAllLink = true, copy }: FeaturedProjectsIntroProps) {
  const text = {
    eyebrow: copy?.eyebrow?.trim() || HOME_PAGE_DEFAULTS.projects.eyebrow,
    title: copy?.title?.trim() || HOME_PAGE_DEFAULTS.projects.title,
    body: copy?.body?.trim() || HOME_PAGE_DEFAULTS.projects.body,
    linkLabel: copy?.linkLabel?.trim() || HOME_PAGE_DEFAULTS.projects.linkLabel,
  };

  return (
    <div className="bg-paper">
      <Container className="flex flex-col justify-end pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-brick">{text.eyebrow}</p>
            <h2 className="mt-5 text-balance text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] tracking-tightest text-forest">
              {text.title}
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-forest/70 md:text-lg">
              {text.body}
            </p>
          </div>

          {showAllLink && (
            <div className="shrink-0 md:pb-2">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 text-base text-forest transition-colors hover:text-brick md:text-lg"
              >
                {text.linkLabel}
                <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-2">
                  {"\u2190"}
                </span>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
