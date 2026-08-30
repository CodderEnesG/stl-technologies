import { getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { ChairHotspots } from "../components/brand/ChairHotspots";
import {
  BrandAbout,
  BrandCTA,
  BrandHeroFull,
  BrandShell,
  ProductRange,
  PullQuote,
  SpecBand,
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
        mark="/logos/oxyra-mark-light.svg"
        eyebrow={c.brandAbout.eyebrow}
        title={c.brandAbout.title}
        body={c.brandAbout.body}
      />
      <SpecBand ctx={ctx} specs={c.specBand} icons={["frame", "person-standing", "layers", "rotate-ccw"]} />
      <ChairHotspots
        ctx={ctx}
        eyebrow={c.hotspotsEyebrow}
        title={c.hotspotsTitle}
        // hint={c.hotspotsHint}
        image="/images/oxyra/koltuk-oxyra.jpg"
        hotspots={c.hotspots}
      />
      <ProductRange
        ctx={ctx}
        eyebrow={c.rangeEyebrow}
        title={c.rangeTitle}
        description={c.rangeDescription}
        items={c.range}
        href={ctx.brand.channelHref}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
