import { bnkProducts, getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  BrandHero,
  BrandIntro,
  BrandShell,
  Editorial,
  ImageBand,
  ProductVitrine,
  PullQuote,
  SpecBand,
  ValueProps,
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
      <BrandHero ctx={ctx} tagline={c.tagline} />
      <BrandIntro
        ctx={ctx}
        mark="/logos/bnk-dark.svg"
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
        stats={c.stats}
      />
      <SpecBand ctx={ctx} specs={c.specBand} icons={["sparkles", "sun-moon", "clock", "droplet"]} />
      <ValueProps ctx={ctx} items={c.valueProps} icons={["droplet", "flask-conical", "sun-moon"]} />
      <ProductVitrine ctx={ctx} title={c.vitrineTitle} products={bnkProducts} />
      <Editorial
        ctx={ctx}
        image="unsplash:1590393802710-dbf451560939"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <ImageBand
        images={[
          "unsplash:1741896136113-c33a4fded0b5",
          "unsplash:1623143445418-40c192fa3d11",
          "unsplash:1590393802710-dbf451560939",
          "unsplash:1741896135490-4062a3b21abf",
        ]}
      />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} note={c.launchNote} />
    </BrandShell>
  );
}
