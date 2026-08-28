import { getBrand, oxyraProducts } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  BrandHero,
  BrandIntro,
  BrandShell,
  CategoryGrid,
  Editorial,
  ImageBand,
  ProductVitrine,
  PullQuote,
  SpecBand,
  ValueProps,
  type BrandCtx,
} from "../components/brand/sections";

export default function Oxyra() {
  const { t } = useI18n();
  const c = t.brands.oxyra;
  usePageMeta(t.meta.oxyra.title, t.meta.oxyra.desc);

  // Marka kılavuzu: başlıklar Manifold Extd CF Heavy, gövde Inter (site geneli --font-sans)
  const ctx: BrandCtx = { brand: getBrand("oxyra"), tone: "dark", font: "font-oxyra" };

  return (
    <BrandShell ctx={ctx}>
      <BrandHero ctx={ctx} tagline={c.tagline} />
      <BrandIntro ctx={ctx} kicker={c.about.kicker} title={c.about.title} body={c.about.body} stats={c.stats} />
      <SpecBand ctx={ctx} specs={c.specBand} />
      <ValueProps ctx={ctx} items={c.valueProps} />
      <CategoryGrid ctx={ctx} label={c.categoriesLabel} categories={c.categories} href={ctx.brand.channelHref} />
      <ProductVitrine ctx={ctx} title={c.vitrineTitle} products={oxyraProducts} />
      <Editorial
        ctx={ctx}
        image="/images/oxyra/koltuk-oxyra.jpg"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <ImageBand
        images={[
          "/images/oxyra/koltuk-oxyra.jpg",
          "/images/oxyra/headset-oxyra.jpg",
          "/images/oxyra/mouse-oxyra.jpg",
          "/images/oxyra/koltuk-rampage-1.jpg",
        ]}
        blend={[false, false, false, true]}
      />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
