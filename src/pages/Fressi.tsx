import { fressiCategories, fressiCircles, fressiProducts, getBrand } from "../data/brands";
import { fressiReviews, fressiReviewStats } from "../data/fressiReviews";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  Editorial,
  FressiCategoryBar,
  FressiCircleRail,
  FressiGallery,
  FressiHeroSlideshow,
  FressiIntro,
  FressiReviews,
  ProductVitrine,
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
        image="/images/fressi/life-cay-keyfi.webp"
        pattern={PATTERN}
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
      <ProductVitrine ctx={ctx} title={c.vitrineTitle} products={fressiProducts} />
      <Editorial
        ctx={ctx}
        image="/images/fressi/life-tezgah-renkli.webp"
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
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
      />
      <FressiGallery
        ctx={ctx}
        eyebrow={c.gallery.eyebrow}
        title={c.gallery.title}
        pattern={PATTERN}
        images={[
          { src: "/images/fressi/life-tezgah-sade.webp", alt: "Fressi kahve makinesi, kettle ve ekmek kızartma makinesi mutfak tezgahında", wide: true },
          { src: "/images/fressi/dunya-mutfak-set.webp", alt: "Fressi ürün ve ambalaj seti mutfakta" },
          { src: "/images/fressi/life-kettle-makro.webp", alt: "Fressi kettle yakın çekim" },
          { src: "/images/fressi/dunya-ambalaj.webp", alt: "Fressi ambalaj ve kurumsal basılı malzemeler" },
          { src: "/images/fressi/dunya-magaza.webp", alt: "Fressi mağaza konsepti" },
          { src: "/images/fressi/dunya-billboard.webp", alt: "Fressi açıkhava reklam konsepti" },
          { src: "/images/fressi/dunya-lansman.webp", alt: "Fressi lansman sahnesi konsepti", wide: true },
        ]}
      />
      <BrandCTA
        ctx={ctx}
        title={c.quote.text}
        quoteSource={c.quote.source}
        channel={c.channel}
        image="/images/fressi/gradient-koyu.png"
      />
    </BrandShell>
  );
}
