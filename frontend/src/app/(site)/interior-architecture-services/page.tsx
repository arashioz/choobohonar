import type { Metadata } from "next";
import InteriorBenefitsSection from "@/components/interior/InteriorBenefitsSection";
import InteriorConsultationCta from "@/components/interior/InteriorConsultationCta";
import InteriorCustomizationBand from "@/components/interior/InteriorCustomizationBand";
import InteriorHero from "@/components/interior/InteriorHero";
import InteriorIntroSection from "@/components/interior/InteriorIntroSection";
import InteriorProcessSection from "@/components/interior/InteriorProcessSection";
import InteriorProjectsBand from "@/components/interior/InteriorProjectsBand";
import { fetchPublicCmsPage } from "@/lib/public-cms";
import { featuredProjectsFrom, fetchPublicProjects } from "@/lib/public-projects";
import { INTERIOR_PAGE_DEFAULTS, readInteriorPageContent } from "@/lib/interior-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublicCmsPage("interior");
  const content = readInteriorPageContent(page);
  return {
    title: content.metaTitle || INTERIOR_PAGE_DEFAULTS.metaTitle,
    description: content.metaDescription || INTERIOR_PAGE_DEFAULTS.metaDescription,
  };
}

export default async function InteriorArchitectureServicesPage() {
  const [page, projects] = await Promise.all([fetchPublicCmsPage("interior"), fetchPublicProjects()]);
  const content = readInteriorPageContent(page);

  return (
    <>
      <InteriorHero content={content.hero} />
      <InteriorIntroSection content={content.intro} styles={content.styles} />
      <InteriorBenefitsSection heading={content.benefitsHeading} items={content.benefits} />
      <InteriorProcessSection heading={content.processHeading} steps={content.processSteps} />
      <InteriorCustomizationBand heading={content.customizationHeading} items={content.customizationPieces} />
      <InteriorProjectsBand projects={featuredProjectsFrom(projects, 8)} copy={content.projects} />
      <InteriorConsultationCta heading={content.consultation} channels={content.consultationChannels} />
    </>
  );
}
