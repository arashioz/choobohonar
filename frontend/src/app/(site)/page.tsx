import ExperiencePromoPopup from "@/components/home/ExperiencePromoPopup";
import HeroSection from "@/components/sections/HeroSection";
import { readHomePageContent } from "@/lib/home-page-content";
import { fetchPublicCmsPage } from "@/lib/public-cms";
import DiversitySection from "@/components/sections/DiversitySection";
import ApproachSection from "@/components/sections/ApproachSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import InterludeSection from "@/components/sections/InterludeSection";
import WorkAreasSection from "@/components/sections/WorkAreasSection";
import MagazineSection from "@/components/sections/MagazineSection";
import ConsultationSection from "@/components/sections/ConsultationSection";

export default async function Home() {
  const content = readHomePageContent(await fetchPublicCmsPage("home"));

  return (
    <>
      <ExperiencePromoPopup promo={content.promo} />
      <HeroSection
        desktopVideo={content.hero.desktopVideo}
        mobileVideo={content.hero.mobileVideo}
        title={content.hero.title}
        ctaLabel={content.hero.ctaLabel}
        ctaHref={content.hero.ctaHref}
      />
      <DiversitySection images={content.showcase} copy={content.diversity} />
      <ApproachSection eyebrow={content.approach.eyebrow} steps={content.approach.steps} />
      <FeaturedProjectsSection copy={content.projects} />
      <InterludeSection copy={content.interlude} />
      <WorkAreasSection eyebrow={content.workAreas.eyebrow} items={content.workAreas.items} />
      <MagazineSection title={content.magazine.title} linkLabel={content.magazine.linkLabel} />
      <ConsultationSection copy={content.consultation} />
    </>
  );
}
