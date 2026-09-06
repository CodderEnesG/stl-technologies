import { getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { ProductHotspots } from "../components/brand/ProductHotspots";
import {
  BrandAbout,
  BrandCTA,
  BrandHeroFull,
  BrandShell,
  ProductRange,
  ProductSpotlight,
  type BrandCtx,
} from "../components/brand/sections";

export default function Oxyra() {
  const { t } = useI18n();
  const c = t.brands.oxyra;
  usePageMeta(t.meta.oxyra.title, t.meta.oxyra.desc);

  // Marka kılavuzu: başlıklar Manifold Extended CF, gövde Inter (site geneli --font-sans)
  const ctx: BrandCtx = { brand: getBrand("oxyra"), tone: "dark", font: "font-oxyra", bodyFont: "font-inter", iconWeight: 2.1 };

  return (
    <BrandShell ctx={ctx}>
      <BrandHeroFull ctx={ctx} tagline={c.tagline} background="/images/oxyra/hero-setup.jpg" />
      <BrandAbout
        ctx={ctx}
        photo="/images/oxyra/mooncha/1.jpg"
        photoFocus="50% 35%"
        eyebrow={c.brandAbout.eyebrow}
        title={c.brandAbout.title}
        body={c.brandAbout.body}
      />
      <ProductHotspots
        ctx={ctx}
        eyebrow={c.hotspotsEyebrow}
        title={c.hotspotsTitle}
        hint={c.hotspotsHint}
        image="/images/oxyra/koltuk-oxyra.jpg"
        hotspots={c.hotspots}
      />
      <ProductSpotlight
        ctx={ctx}
        kicker={c.spotlight.kicker}
        title={c.spotlight.title}
        text={c.spotlight.text}
        specs={c.spotlight.specs}
        cta={c.spotlight.cta}
        href={ctx.brand.channelHref}
        images={[1, 2, 3, 4, 5, 6, 7].map((n) => `/images/oxyra/mooncha/${n}.jpg`)}
        alts={c.spotlight.alts}
      />
      <ProductRange
        ctx={ctx}
        eyebrow={c.rangeEyebrow}
        title={c.rangeTitle}
        description={c.rangeDescription}
        items={c.range}
        href={ctx.brand.channelHref}
      />
      <BrandCTA
        ctx={ctx}
        title={c.ctaTitle}
        channel={c.channel}
        image="/images/oxyra/koltuk-oxyra.jpg"
        imageFocus="50% 42%"
      />
    </BrandShell>
  );
}
