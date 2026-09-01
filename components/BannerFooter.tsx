import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

export default function BannerFooter() {
  return (
    <section className="py-12">
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative w-full aspect-[3/2] sm:aspect-[1774/887] overflow-hidden rounded-xl">
            <Image
              src="/images/ad-ptg.png"
              alt="Banner Footer"
              fill
              sizes="(max-width: 1774px) 100vw, 1774px"
              className="object-contain"
            />
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
