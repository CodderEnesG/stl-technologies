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
  SpecBand,
  PullQuote,
  type BrandCtx,
} from "../components/brand/sections";
import { WextaHero } from "../components/brand/wextaHero";
import { SizeGuide } from "../components/brand/wexta/SizeGuide";
import { SeriesGuide } from "../components/brand/wexta/SeriesGuide";
import { StageStrip } from "../components/brand/wexta/StageStrip";
import { ShellTrio } from "../components/brand/wexta/ShellTrio";

/**
 * wexta sayfası — "valiz rehberi" kurgusu (referans: rimowa.com luggage guide).
 * Sıra: boy seç → seri seç → teknik → üretim → gövde kartları → söylem → CTA.
 * Tüm ürün verisi Wexta 2023 kataloğundan (general_assets/wexta/wexta-katalog-2023.pdf).
 *
 * Müşteri notları (2026-09-05): hero "katalog kapağı" varyantına sabitlendi, kapak
 * görseli değişti; yaşam fotoğrafı bandı ve katalog/teklif/OEM kartları kaldırıldı
 * (katalog linki seri rehberinde). Açık istekler: general_assets/wexta-musteriden-istekler.md
 */
export default function Wexta() {
  const { t, lang } = useI18n();
  const c = t.brands.wexta;
  usePageMeta(t.meta.wexta.title, t.meta.wexta.desc);

  // Katalog dili: beyaz zemin, koyu tipografi, siyah bantlar; turkuaz sadece vurgu
  // Başlık fontu wexta wordmark'ının yuvarlak geometrik karakterini izler
  const ctx: BrandCtx = { brand: getBrand("wexta"), tone: "mono", font: "font-geometric", bodyFont: "font-geometric", iconWeight: 1.45 };
  const ribbon = lang === "tr" ? { left: "Seyahat", right: "Valiz" } : { left: "Travel", right: "Luggage" };

  // Üç gövde kartı: ABS (WX-1001), polipropilen (PP10), çocuk (WX-414) — katalog kesitleri düz stüdyo zemininde
  const bySeries = (code: string) => wextaSeries.find((sr) => sr.code === code);
  const shellVisuals = [
    { ...bySeries("WX-1001")!, bg: "#e9e6e1" },
    { ...bySeries("WX-PP10")!, bg: "#dfe7ea" },
    { ...bySeries("WX-41x")!, bg: "#f3ecdf" },
  ];
  const shellCards = c.shells.items.map((item, i) => ({
    ...item,
    cta: c.shells.cta,
    image: shellVisuals[i].image,
    bg: shellVisuals[i].bg,
    href: shellVisuals[i].href,
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
      <SeriesGuide ctx={ctx} copy={c.series} series={wextaSeries} catalogHref={wextaCatalogPdf} />
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
      <ShellTrio ctx={ctx} eyebrow={c.shells.eyebrow} title={c.shells.title} cards={shellCards} />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} bg="#17181a" fg="#ffffff" />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
