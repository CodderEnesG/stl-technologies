import { fressiCategories, fressiProducts, getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  BrandHero,
  BrandIntro,
  BrandShell,
  Editorial,
  FressiCategoryGrid,
  ImageBand,
  ProductVitrine,
  PullQuote,
  ValueProps,
  type BrandCtx,
} from "../components/brand/sections";

export default function Fressi() {
  const { t } = useI18n();
  const c = t.brands.fressi;
  usePageMeta(t.meta.fressi.title, t.meta.fressi.desc);

  const ctx: BrandCtx = { brand: getBrand("fressi"), tone: "cream", font: "font-nunito", bodyFont: "font-nunito" };

  return (
    <BrandShell ctx={ctx}>
      <BrandHero
        ctx={ctx}
        tagline={c.tagline}
        scriptAccent={c.scriptAccent}
        pattern="/images/fressi/pattern-1.svg"
      />
      <BrandIntro ctx={ctx} kicker={c.about.kicker} title={c.about.title} body={c.about.body} stats={c.stats} />
      <ValueProps ctx={ctx} items={c.valueProps} />
      <FressiCategoryGrid ctx={ctx} label={c.categoriesLabel} categories={fressiCategories} />
      <ProductVitrine ctx={ctx} title={c.vitrineTitle} products={fressiProducts} />
      <Editorial
        ctx={ctx}
        image="/images/fressi/espresso-em01.webp"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <ImageBand
        images={[
          "/images/fressi/kettle-kt07.webp",
          "/images/fressi/turk-kahve-tk302.webp",
          "/images/fressi/tost-tm26.webp",
          "/images/fressi/pikap-p101.webp",
        ]}
      />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
