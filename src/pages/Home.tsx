import { Suspense, lazy } from "react";
import { stlImages } from "../data/brands";
import { partnerLogos } from "../data/partners";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { BrandCube } from "../components/BrandCube";
import { Hero } from "../components/hero";
import { PartnerLogos } from "../components/PartnerLogos";
import {
  AboutBlock,
  ContactSection,
  MissionVision,
  stlCtx,
} from "../components/sections";

// Dünya haritası path verisi ~100 KB — ilk yükte değil, ayrı parçada gelsin.
const ExportMap = lazy(() =>
  import("../components/ExportMap").then((m) => ({ default: m.ExportMap })),
);

/**
 * Çatı site tek sayfa: hakkımızda, markalar ve iletişim ayrı sayfa değil,
 * bu sayfanın bölümleri. Navbar/footer bağlantıları #hakkimizda, #markalar,
 * #iletisim çıpalarına gider.
 */
export default function Home() {
  const { t } = useI18n();
  usePageMeta(t.meta.home.title, t.meta.home.desc);
  const w = t.home.whoWeAre;
  const a = t.about;

  return (
    <>
      <h1 className="sr-only">{t.meta.home.title}</h1>
      <Hero />

      <AboutBlock
        ctx={stlCtx}
        id="hakkimizda"
        eyebrow={w.eyebrow}
        title={w.title}
        paragraphs={w.paragraphs}
        image={stlImages.building}
        imageAlt={a.buildingAlt}
        stats={t.home.stats}
        statIcons={["calendar-days", "factory", "globe"]}
      />

      <MissionVision
        ctx={stlCtx}
        eyebrow={a.missionEyebrow}
        title={a.missionTitle}
        items={[a.mission, a.vision]}
        icons={["target", "eye"]}
      />

      {/* "STL Dünyası" bento bölümü müşteri kararına kadar kapalı.
          Metinler t.home.bento'da, bileşen components/sections içinde duruyor. */}
      {/* <Bento
        ctx={stlCtx}
        copy={t.home.bento}
        productionImage={stlImages.factory}
        oemImage={stlImages.luggage}
        productionAlt={a.lineAlt}
      /> */}

      <BrandCube
        ctx={stlCtx}
        id="markalar"
        eyebrow={t.home.portfolioEyebrow}
        title={t.home.portfolioTitle}
        description={t.home.portfolioDescription}
      />

      <PartnerLogos
        ctx={stlCtx}
        kicker={t.home.partnersKicker}
        title={t.home.partnersTitle}
        note={t.home.partnersNote}
        items={partnerLogos}
        icon="store"
      />

      <Suspense fallback={<div className="min-h-[520px]" aria-hidden />}>
        <ExportMap ctx={stlCtx} />
      </Suspense>

      <ContactSection ctx={stlCtx} id="iletisim" />
    </>
  );
}
