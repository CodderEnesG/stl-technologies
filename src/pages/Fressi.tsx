import { fressiCategories, fressiCircles, fressiProducts, getBrand } from "../data/brands";
import { fressiReviews, fressiReviewStats } from "../data/fressiReviews";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  Editorial,
  FressiCategoryBar,
  FressiCircleRail,
  FressiHeroSlideshow,
  FressiIntro,
  FressiReviews,
  ImageBand,
  ProductVitrine,
  PullQuote,
  ValueProps,
  BrandShell,
  type BrandCtx,
} from "../components/brand/sections";

/** Marka pattern'i — hero, hakkında, ürün rayı ve alıntı bölümlerinin ortak zemini */
const PATTERN = "/images/fressi/pattern-1.svg";

export default function Fressi() {
  const { t } = useI18n();
  const c = t.brands.fressi;
  usePageMeta(t.meta.fressi.title, t.meta.fressi.desc);

  const ctx: BrandCtx = { brand: getBrand("fressi"), tone: "cream", font: "font-nunito", bodyFont: "font-nunito", iconWeight: 1.7 };

  return (
    <BrandShell ctx={ctx}>
      <FressiHeroSlideshow
        ctx={ctx}
        pattern={PATTERN}
        logo={ctx.brand.logoDark}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
        slides={[
          {
            image: "/images/fressi/hero-banner-1.webp",
            title: c.hero.slides[0].title,
            sub: c.hero.slides[0].sub,
            cta: c.hero.slides[0].cta,
            href: ctx.brand.channelHref,
            align: "left",
            focus: "75% 50%",
          },
          {
            image: "/images/fressi/hero-banner-2.webp",
            title: c.hero.slides[1].title,
            sub: c.hero.slides[1].sub,
            cta: c.hero.slides[1].cta,
            href: "https://fressihome.com/collections/airfryer-firin",
            align: "center",
            valign: "top",
            onDark: true,
            focus: "50% 55%",
          },
        ]}
      />
      <FressiCategoryBar ctx={ctx} categories={fressiCategories} />
      <FressiIntro
        ctx={ctx}
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
        stats={c.stats}
        image="/images/fressi/kettle-kt07-hero.jpg"
        pattern={PATTERN}
        signature={c.aboutSignature}
      />
      <FressiCircleRail
        ctx={ctx}
        eyebrow={c.circles.eyebrow}
        title={c.circles.title}
        items={fressiCircles}
        pattern={PATTERN}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
      />
      <ValueProps ctx={ctx} items={c.valueProps} icons={["sparkles", "palette", "house"]} />
      <ProductVitrine ctx={ctx} title={c.vitrineTitle} products={fressiProducts} />
      <Editorial
        ctx={ctx}
        image="/images/fressi/espresso-em01.webp"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <FressiReviews
        ctx={ctx}
        eyebrow={c.reviews.eyebrow}
        title={c.reviews.title}
        reviews={fressiReviews}
        stats={fressiReviewStats}
        ratingLabel={c.reviews.count}
        verifiedLabel={c.reviews.verified}
        allLabel={c.reviews.all}
        allHref={ctx.brand.channelHref}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} pattern={PATTERN} />
      <ImageBand
        images={[
          "/images/fressi/kettle-kt07.webp",
          "/images/fressi/turk-kahve-tk302.webp",
          "/images/fressi/tost-tm26.webp",
          "/images/fressi/pikap-p101.webp",
        ]}
      />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} pattern={PATTERN} />
    </BrandShell>
  );
}
