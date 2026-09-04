import { getBrand, stlImages, wextaCatalogPdf, wextaImages, wextaSeries } from "../data/brands";
import { useI18n } from "../i18n";
import { ProductHotspots } from "../components/brand/ProductHotspots";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  BrandIntro,
  BrandShell,
  CatalogRibbon,
  Editorial,
  ImageBand,
  SpecBand,
  PullQuote,
  type BrandCtx,
} from "../components/brand/sections";
import { WextaHero } from "../components/brand/wextaHero";
import { SizeGuide } from "../components/brand/wexta/SizeGuide";
import { SeriesGuide } from "../components/brand/wexta/SeriesGuide";
import { StageStrip } from "../components/brand/wexta/StageStrip";
import { ServiceTiles } from "../components/brand/wexta/ServiceTiles";

/**
 * wexta sayfası — "valiz rehberi" kurgusu (referans: rimowa.com luggage guide).
 * Sıra: boy seç → seri seç → teknik → üretim → yaşam → hizmet.
 * Tüm ürün verisi Wexta 2023 kataloğundan (general_assets/wexta/wexta-katalog-2023.pdf).
 */
export default function Wexta() {
  const { t, lang } = useI18n();
  const c = t.brands.wexta;
  usePageMeta(t.meta.wexta.title, t.meta.wexta.desc);

  // Katalog dili: beyaz zemin, koyu tipografi, siyah bantlar; turkuaz sadece vurgu
  // Başlık fontu wexta wordmark'ının yuvarlak geometrik karakterini izler
  const ctx: BrandCtx = { brand: getBrand("wexta"), tone: "mono", font: "font-geometric", bodyFont: "font-geometric", iconWeight: 1.45 };
  const ribbon = lang === "tr" ? { left: "Seyahat", right: "Valiz" } : { left: "Travel", right: "Luggage" };

  const serviceImages = [wextaImages.escalator, stlImages.factory, wextaImages.family];
  const tiles = c.services.tiles.map((tile, i) => ({
    ...tile,
    image: serviceImages[i],
    href: i === 0 ? wextaCatalogPdf : undefined,
  }));

  return (
    <BrandShell ctx={ctx}>
      <WextaHero ctx={ctx} channelHref={ctx.brand.channelHref} />
      <CatalogRibbon left={ribbon.left} right={ribbon.right} logo="/logos/wexta-light.svg" />
      <BrandIntro
        ctx={ctx}
        mark="/logos/wexta.svg"
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
        stats={c.stats}
      />
      <SizeGuide
        ctx={ctx}
        eyebrow={c.guide.eyebrow}
        title={c.guide.title}
        lead={c.guide.lead}
        note={c.guide.note}
        sizes={c.guide.sizes}
        set={c.guide.set}
        image={wextaImages.sizeCutout}
      />
      <SeriesGuide ctx={ctx} copy={c.series} series={wextaSeries} />
      <SpecBand ctx={ctx} specs={c.specBand} icons={["layers", "ruler", "wrench", "factory"]} />
      <ProductHotspots
        ctx={ctx}
        eyebrow={c.hotspotsEyebrow}
        title={c.hotspotsTitle}
        hint={c.hotspotsHint}
        image="/images/stl/valiz-wx1001-1.jpg"
        hotspots={c.hotspots}
      />
      <StageStrip ctx={ctx} eyebrow={c.stages.eyebrow} title={c.stages.title} lead={c.stages.lead} stages={c.stages.items} />
      <div className="pt-16">
        <Editorial ctx={ctx} image={stlImages.factory} title={c.parts.title} text={c.parts.text} ratio="aspect-[4/3]" />
      </div>
      <ImageBand images={[wextaImages.escalator, stlImages.travel, wextaImages.family, wextaImages.kids]} />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} bg="#17181a" fg="#ffffff" />
      <ServiceTiles ctx={ctx} eyebrow={c.services.eyebrow} title={c.services.title} tiles={tiles} />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
