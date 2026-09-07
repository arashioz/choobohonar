import CampaignHero from "@/components/campaign/CampaignHero";
import StorySection from "@/components/campaign/StorySection";
import TiersSection from "@/components/campaign/TiersSection";
import GoodsAndScope from "@/components/campaign/GoodsAndScope";

export default function HomePage() {
  return (
    <>
      <CampaignHero />
      <StorySection />
      <TiersSection />
      <GoodsAndScope />
    </>
  );
}
