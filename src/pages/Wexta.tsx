import { getBrand, stlImages, wextaProducts } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  BrandIntro,
  BrandShell,
  CatalogRibbon,
  CategoryGrid,
  Editorial,
  ImageBand,
  ManufacturingStory,
  ProductVitrine,
  PullQuote,
  type BrandCtx,
} from "../components/brand/sections";
import { WextaSlider } from "../components/brand/WextaSlider";

export default function Wexta() {
  const { t, lang } = useI18n();
  const c = t.brands.wexta;
  usePageMeta(t.meta.wexta.title, t.meta.wexta.desc);

  // Katalog dili: beyaz zemin, koyu tipografi, siyah bantlar; turkuaz sadece vurgu
  // Başlık fontu wexta wordmark'ının yuvarlak geometrik karakterini izler
  const ctx: BrandCtx = { brand: getBrand("wexta"), tone: "mono", font: "font-geometric" };
  const ribbon = lang === "tr" ? { left: "Seyahat", right: "Valiz" } : { left: "Travel", right: "Luggage" };

  return (
    <BrandShell ctx={ctx}>
      <WextaSlider channelHref={ctx.brand.channelHref} />
      <CatalogRibbon left={ribbon.left} right={ribbon.right} logo="/logos/wexta-light.svg" />
      <BrandIntro ctx={ctx} kicker={c.about.kicker} title={c.about.title} body={c.about.body} stats={c.stats} />
      <ManufacturingStory
        ctx={ctx}
        kicker={c.manufacturing.kicker}
        title={c.manufacturing.title}
        body={c.manufacturing.body}
        points={c.manufacturing.points}
        image={stlImages.factory}
      />
      <CategoryGrid ctx={ctx} label={c.categoriesLabel} categories={c.categories} href={ctx.brand.channelHref} />
      <ProductVitrine ctx={ctx} title={c.vitrineTitle} products={wextaProducts} />
      <Editorial
        ctx={ctx}
        image={stlImages.travel}
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} bg="#17181a" fg="#ffffff" />
      <ImageBand
        images={[
          "/images/stl/valiz-milano-1.jpg",
          "/images/stl/valiz-wx300-1.jpg",
          "/images/stl/valiz-wx1001-1.jpg",
          "/images/stl/valiz-wx300-2.jpg",
        ]}
        blend={[true, true, true, true]}
      />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
