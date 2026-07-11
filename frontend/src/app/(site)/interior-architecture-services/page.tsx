import type { Metadata } from "next";
import InteriorBenefitsSection from "@/components/interior/InteriorBenefitsSection";
import InteriorConsultationCta from "@/components/interior/InteriorConsultationCta";
import InteriorHero from "@/components/interior/InteriorHero";
import InteriorIntroSection from "@/components/interior/InteriorIntroSection";
import InteriorProcessSection from "@/components/interior/InteriorProcessSection";
import InteriorProjectsBand from "@/components/interior/InteriorProjectsBand";

export const metadata: Metadata = {
  title: "خدمات معماری داخلی | خانه چوب و هنر",
  description:
    "برای دریافت مشاوره چیدمان و خدمات طراحی داخلی، با کارشناسان معماری داخلی خانه چوب و هنر صحبت کنید. امکان مشاوره حضوری، تلفنی و آنلاین.",
};

export default function InteriorArchitectureServicesPage() {
  return (
    <>
      <InteriorHero />
      <InteriorIntroSection />
      <InteriorBenefitsSection />
      <InteriorProcessSection />
      <InteriorProjectsBand />
      <InteriorConsultationCta />
    </>
  );
}
