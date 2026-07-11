import Link from "next/link";
import Container from "@/components/layout/Container";

type FeaturedProjectsIntroProps = {
  showAllLink?: boolean;
};

export default function FeaturedProjectsIntro({ showAllLink = true }: FeaturedProjectsIntroProps) {
  return (
    <div className="bg-paper">
      <Container className="flex flex-col justify-end pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-brick">{"\u067e\u0631\u0648\u0698\u0647\u200c\u0647\u0627\u06cc \u0645\u0646\u062a\u062e\u0628"}</p>
            <h2 className="mt-5 text-balance text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] tracking-tightest text-forest">
              {"\u0641\u0636\u0627\u0647\u0627\u06cc\u06cc \u06a9\u0647 \u0628\u0627 \u0686\u0648\u0628\u060c \u0646\u0648\u0631 \u0648 \u062f\u0633\u062a \u0633\u0627\u062e\u062a\u0647 \u0634\u062f\u0647\u200c\u0627\u0646\u062f"}
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-forest/70 md:text-lg">
              {
                "\u0627\u0632 \u0622\u067e\u0627\u0631\u062a\u0645\u0627\u0646\u200c\u0647\u0627\u06cc \u0645\u0633\u06a9\u0648\u0646\u06cc \u062a\u0627 \u0647\u062a\u0644\u200c\u0647\u0627 \u0648 \u0648\u06cc\u0644\u0627\u0647\u0627\u06cc \u0627\u0642\u0627\u0645\u062a\u06cc \u2014 \u0647\u0631 \u067e\u0631\u0648\u0698\u0647 \u0631\u0648\u0627\u06cc\u062a\u06cc \u0627\u0633\u062a \u0627\u0632 \u0632\u0646\u062f\u06af\u06cc \u0648\u0627\u0642\u0639\u06cc \u062f\u0631 \u0641\u0636\u0627\u060c \u0628\u0627 \u0645\u0628\u0644\u0645\u0627\u0646 \u0633\u0641\u0627\u0631\u0634\u06cc \u0648 \u062c\u0632\u0626\u06cc\u0627\u062a \u0627\u062c\u0631\u0627\u06cc\u06cc \u062e\u0627\u0646\u0647 \u0686\u0648\u0628 \u0648 \u0647\u0646\u0631."
              }
            </p>
          </div>

          {showAllLink && (
            <div className="shrink-0 md:pb-2">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 text-base text-forest transition-colors hover:text-brick md:text-lg"
              >
                {"\u0645\u0634\u0627\u0647\u062f\u0647 \u0647\u0645\u0647 \u067e\u0631\u0648\u0698\u0647\u200c\u0647\u0627"}
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
