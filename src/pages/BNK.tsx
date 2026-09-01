import { bnkCategories, bnkCircles, bnkProducts, getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  BrandCategoryBar,
  BrandHeroSlideshow,
  BrandIntro,
  BrandShell,
  CircleRail,
  Editorial,
  ProductVitrine,
  PullQuote,
  SpecBand,
  type BrandCtx,
} from "../components/brand/sections";

export default function BNK() {
  const { t } = useI18n();
  const c = t.brands.bnk;
  usePageMeta(t.meta.bnk.title, t.meta.bnk.desc);

  // Logo wordmark'ı geometrik sans; başlıklar Poppins ile aynı karakterde
  const ctx: BrandCtx = { brand: getBrand("bnk"), tone: "pink", font: "font-geometric", bodyFont: "font-geometric", iconWeight: 1.35 };

  return (
    <BrandShell ctx={ctx}>
      {/* Banner metinleri görselin içinde geldiği için üstüne başlık binmiyor */}
      <BrandHeroSlideshow
        ctx={ctx}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
        slides={[
          {
            image: "/images/bnk/hero-banner-1.webp",
            cta: c.hero.slides[0].cta,
            href: "https://beautynetkorea.com.tr/collections/yuz-gunes-kremi",
            align: "left",
            valign: "bottom",
          },
          {
            image: "/images/bnk/hero-banner-2.webp",
            cta: c.hero.slides[1].cta,
            href: "https://beautynetkorea.com.tr/collections/tonik",
            align: "left",
            valign: "bottom",
          },
        ]}
      />
      <BrandCategoryBar ctx={ctx} categories={bnkCategories} />
      <BrandIntro
        ctx={ctx}
        mark="/logos/bnk-dark.svg"
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
        stats={c.stats}
      />
      <CircleRail
        ctx={ctx}
        eyebrow={c.circles.eyebrow}
        title={c.circles.title}
        items={bnkCircles}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
      />
      <SpecBand ctx={ctx} specs={c.specBand} icons={["sparkles", "sun-moon", "clock", "droplet"]} />
      <ProductVitrine ctx={ctx} title={c.vitrineTitle} products={bnkProducts} />
      <Editorial
        ctx={ctx}
        image="/images/bnk/lookbook.webp"
        ratio="aspect-[16/9]"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
