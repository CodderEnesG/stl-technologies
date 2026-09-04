import { useEffect, useState } from "react";
import { fressiCategories, fressiCircles, fressiProducts, getBrand } from "../data/brands";
import { fetchLiveFressiReviews, fressiReviews, type FressiReview } from "../data/fressiReviews";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  BrandCTA,
  Editorial,
  BrandCategoryBar,
  CircleRail,
  BrandGallery,
  BrandHeroSlideshow,
  EditorialIntro,
  ReviewSlider,
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

  // Yorumlar: önce statik anlık görüntü, mağazanın Entrfy ucu erişilebilirse canlı liste
  const [reviews, setReviews] = useState<FressiReview[]>(fressiReviews);
  useEffect(() => {
    const ac = new AbortController();
    fetchLiveFressiReviews(ac.signal).then((live) => {
      if (live) setReviews(live);
    });
    return () => ac.abort();
  }, []);

  return (
    <BrandShell ctx={ctx}>
      <BrandHeroSlideshow
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
      <BrandCategoryBar ctx={ctx} categories={fressiCategories} />
      <EditorialIntro
        ctx={ctx}
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
        signature={c.tagline}
        image="/images/fressi/home-tk302-sofra.webp"
        imageAlt="Fressi Türk kahvesi makinesiyle sofrada kahve keyfi"
        pattern={PATTERN}
      />
      <CircleRail
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
        image="/images/fressi/home-tk302-mutfak.webp"
        ratio="aspect-[3/2]"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <ReviewSlider
        ctx={ctx}
        eyebrow={c.reviews.eyebrow}
        title={c.reviews.title}
        reviews={reviews}
        verifiedLabel={c.reviews.verified}
        allLabel={c.reviews.all}
        allHref={ctx.brand.channelHref}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
      />
      <BrandGallery
        ctx={ctx}
        eyebrow={c.gallery.eyebrow}
        title={c.gallery.title}
        pattern={PATTERN}
        images={[
          { src: "/images/fressi/life-tezgah-renkli.webp", alt: "Fressi yeşil kettle, espresso makinesi, tost makinesi, blender ve airfryer mutfak tezgahında", wide: true },
          { src: "/images/fressi/home-p101-salon.webp", alt: "Fressi Zenitte pikap salonda sehpanın üzerinde" },
          { src: "/images/fressi/home-cd183-salon.webp", alt: "Salonda Fressi Riona CD çalar eşliğinde kahve molası" },
          { src: "/images/fressi/home-tm26-tost.webp", alt: "Fressi Duobello tost makinesiyle kahvaltı" },
          { src: "/images/fressi/home-kt07-cay.webp", alt: "Fressi Mavera kettle ile masada çay servisi" },
          { src: "/images/fressi/life-tezgah-sade.webp", alt: "Fressi kahve makinesi, kettle ve ekmek kızartma makinesi mutfak tezgahında", wide: true },
          { src: "/images/fressi/home-p1990-koltuk.webp", alt: "Koltukta kahve içerken Fressi pikap çalıyor" },
        ]}
      />
      <BrandCTA
        ctx={ctx}
        title={c.quote.text}
        quoted
        channel={c.channel}
        image="/images/fressi/gradient-koyu.png"
      />
    </BrandShell>
  );
}
