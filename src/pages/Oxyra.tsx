import { getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { ChairHotspots } from "../components/brand/ChairHotspots";
import {
  BrandAbout,
  BrandCTA,
  BrandHero,
  BrandIntro,
  BrandShell,
  Editorial,
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
  const ctx: BrandCtx = { brand: getBrand("oxyra"), tone: "dark", font: "font-oxyra" };

  return (
    <BrandShell ctx={ctx}>
      <BrandHero ctx={ctx} tagline={c.tagline} />
      <BrandIntro
        ctx={ctx}
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
        stats={c.stats}
        image="/images/oxyra/koltuk-oxyra.jpg"
      />
      <BrandAbout
        ctx={ctx}
        mark="/logos/oxyra-mark-light.svg"
        eyebrow={c.brandAbout.eyebrow}
        title={c.brandAbout.title}
        body={c.brandAbout.body}
      />
      <SpecBand ctx={ctx} specs={c.specBand} />
      <ChairHotspots
        ctx={ctx}
        eyebrow={c.hotspotsEyebrow}
        title={c.hotspotsTitle}
        hint={c.hotspotsHint}
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
      <Editorial
        ctx={ctx}
        image="/images/oxyra/mouse-oxyra.jpg"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
