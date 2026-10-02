import ExperiencePromoPopup from "@/components/home/ExperiencePromoPopup";
import HeroSection from "@/components/sections/HeroSection";
import { fetchPublicCmsPage } from "@/lib/public-cms";
import DiversitySection from "@/components/sections/DiversitySection";
import ApproachSection from "@/components/sections/ApproachSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import InterludeSection from "@/components/sections/InterludeSection";
import WorkAreasSection from "@/components/sections/WorkAreasSection";
import MagazineSection from "@/components/sections/MagazineSection";
import ConsultationSection from "@/components/sections/ConsultationSection";

function siteMedia(value: unknown, roots: string[]) {
  if (typeof value !== "string") return "";
  const src = value.trim();
  return roots.some((root) => src.startsWith(root)) ? src : "";
}

function readShowcase(page: unknown) {
  if (!page || typeof page !== "object" || !("showcase" in page) || !Array.isArray(page.showcase)) return undefined;
  const shots = page.showcase.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const image = siteMedia("image" in item ? item.image : "", ["/images/", "/uploads/"]);
    const caption = "caption" in item && typeof item.caption === "string" ? item.caption.trim() : "";
    return image && caption ? [{ image, caption }] : [];
  });
  return shots.length === 3 ? shots : undefined;
}

export default async function Home() {
  const page = await fetchPublicCmsPage("home");
  const hero =
    page && typeof page === "object" && "hero" in page && page.hero && typeof page.hero === "object"
      ? (page.hero as { desktopVideo?: string; mobileVideo?: string })
      : undefined;

  return (
    <>
      <ExperiencePromoPopup />
      <HeroSection
        desktopVideo={siteMedia(hero?.desktopVideo, ["/videos/", "/uploads/"])}
        mobileVideo={siteMedia(hero?.mobileVideo, ["/videos/", "/uploads/"])}
      />
      <DiversitySection images={readShowcase(page)} />
      <ApproachSection />
      <FeaturedProjectsSection />
      <InterludeSection />
      <WorkAreasSection />
      <MagazineSection />
      <ConsultationSection />
    </>
  );
}
