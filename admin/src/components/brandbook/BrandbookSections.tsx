import RevealLine from "@/components/motion/RevealLine";
import BrandFoundation from "@/components/brandbook/sections/BrandFoundation";
import StrategicIdentity from "@/components/brandbook/sections/StrategicIdentity";
import ProductDesign from "@/components/brandbook/sections/ProductDesign";
import BrandExperience from "@/components/brandbook/sections/BrandExperience";
import CommunicationSystem from "@/components/brandbook/sections/CommunicationSystem";
import VisualIdentity from "@/components/brandbook/sections/VisualIdentity";
import ImageryGallery from "@/components/brandbook/sections/ImageryGallery";
import CultureFuture from "@/components/brandbook/sections/CultureFuture";

type BrandbookSectionsProps = {
  showDividers?: boolean;
};

export default function BrandbookSections({ showDividers = true }: BrandbookSectionsProps) {
  return (
    <>
      {showDividers ? <RevealLine className="mx-auto max-w-[1600px]" /> : null}

      <section id="foundation" className="scroll-mt-8 brandbook-chapter">
        <BrandFoundation />
      </section>

      {showDividers ? <RevealLine className="mx-auto max-w-[1600px] opacity-60" /> : null}

      <section id="strategy" className="scroll-mt-8 brandbook-chapter">
        <StrategicIdentity />
      </section>

      {showDividers ? <RevealLine className="mx-auto max-w-[1600px] opacity-60" /> : null}

      <section id="product" className="scroll-mt-8 brandbook-chapter">
        <ProductDesign />
      </section>

      <section id="experience" className="scroll-mt-8 brandbook-chapter">
        <BrandExperience />
      </section>

      <section id="communication" className="scroll-mt-8 brandbook-chapter">
        <CommunicationSystem />
      </section>

      <section id="visual" className="scroll-mt-8 brandbook-chapter">
        <VisualIdentity />
      </section>

      <div className="brandbook-chapter">
        <ImageryGallery />
      </div>

      <section id="culture" className="scroll-mt-8 brandbook-chapter">
        <CultureFuture />
      </section>
    </>
  );
}
