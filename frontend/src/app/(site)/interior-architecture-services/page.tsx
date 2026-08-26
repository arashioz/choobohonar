import type { Metadata } from "next";
import InteriorBenefitsSection from "@/components/interior/InteriorBenefitsSection";
import InteriorConsultationCta from "@/components/interior/InteriorConsultationCta";
import InteriorCustomizationBand from "@/components/interior/InteriorCustomizationBand";
import InteriorHero from "@/components/interior/InteriorHero";
import InteriorIntroSection from "@/components/interior/InteriorIntroSection";
import InteriorProcessSection from "@/components/interior/InteriorProcessSection";
import InteriorProjectsBand from "@/components/interior/InteriorProjectsBand";
import { fetchPublicCmsPage } from "@/lib/public-cms";
import {
  consultationChannels,
  interiorBenefits,
  interiorCustomizationPieces,
  interiorHero,
  interiorIntro,
  interiorProcessSteps,
  interiorStyles,
} from "@/data/interior-architecture";

type InteriorPageData = {
  hero: typeof interiorHero;
  intro: typeof interiorIntro;
  customizationPieces: typeof interiorCustomizationPieces;
  benefits: typeof interiorBenefits;
  processSteps: typeof interiorProcessSteps;
  consultationChannels: typeof consultationChannels;
  styles: typeof interiorStyles;
};

export const metadata: Metadata = {
  title: "خدمات معماری داخلی | خانه چوب و هنر",
  description:
    "برای دریافت مشاوره چیدمان و خدمات طراحی داخلی، با کارشناسان معماری داخلی خانه چوب و هنر صحبت کنید. امکان مشاوره حضوری، تلفنی و آنلاین.",
};

export default async function InteriorArchitectureServicesPage() {
  const page = await fetchPublicCmsPage<InteriorPageData>("interior");
  const data = page?.items;
  const content = {
    hero: data?.hero || interiorHero,
    intro: data?.intro || interiorIntro,
    customizationPieces: data?.customizationPieces || interiorCustomizationPieces,
    benefits: data?.benefits || interiorBenefits,
    processSteps: data?.processSteps || interiorProcessSteps,
    consultationChannels: data?.consultationChannels || consultationChannels,
    styles: data?.styles || interiorStyles,
  };

  return (
    <>
      <InteriorHero content={content.hero} />
      <InteriorIntroSection content={content.intro} styles={content.styles} />
      <InteriorBenefitsSection items={content.benefits} />
      <InteriorProcessSection steps={content.processSteps} />
      <InteriorCustomizationBand items={content.customizationPieces} />
      <InteriorProjectsBand />
      <InteriorConsultationCta channels={content.consultationChannels} />
    </>
  );
}
