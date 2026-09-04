import CampaignHero from "@/components/campaign/CampaignHero";
import StorySection from "@/components/campaign/StorySection";
import TiersSection from "@/components/campaign/TiersSection";
import CreditLab from "@/components/campaign/CreditLab";
import GoodsAndScope from "@/components/campaign/GoodsAndScope";
import JoinSection from "@/components/campaign/JoinSection";

export default function HomePage() {
  return (
    <>
      <CampaignHero />
      <StorySection />
      <TiersSection />
      <CreditLab />
      <GoodsAndScope />
      <JoinSection />
    </>
  );
}
