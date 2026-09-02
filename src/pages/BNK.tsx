import { bnkCategories, bnkProducts, getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { BnkHero } from "../components/brand/bnkHero";
import {
  BlogTeasers,
  BrandCTA,
  BrandCategoryBar,
  BrandIntro,
  BrandShell,
  Editorial,
  ProductRail,
  PullQuote,
  RoutineFace,
  SpecBand,
  type BrandCtx,
} from "../components/brand/sections";

const STORE = "https://beautynetkorea.com.tr/collections/";

export default function BNK() {
  const { t } = useI18n();
  const c = t.brands.bnk;
  usePageMeta(t.meta.bnk.title, t.meta.bnk.desc);

  // Marka kendi fontunu vermedi; logodaki keskin geometrik sansa en yakın açık
  // lisanslı aile Asap Sharp (bkz. index.css --font-bnk).
  const ctx: BrandCtx = { brand: getBrand("bnk"), tone: "pink", font: "font-bnk", bodyFont: "font-bnk", iconWeight: 1.35 };

  return (
    <BrandShell ctx={ctx}>
      {/* Banner metinleri görselin içinde geldiği için üstüne başlık binmiyor */}
      <BnkHero
        ctx={ctx}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
        editorial={{
          image: "/images/bnk/model-routine.webp",
          title: c.hero.editorialHero.title,
          sub: c.hero.editorialHero.sub,
          cta: c.hero.editorialHero.cta,
          href: `${STORE}all`,
        }}
        slides={[
          {
            image: "/images/bnk/hero-banner-1.webp",
            cta: c.hero.slides[0].cta,
            href: `${STORE}yuz-gunes-kremi`,
            align: "left",
            valign: "bottom",
          },
          {
            image: "/images/bnk/hero-banner-2.webp",
            cta: c.hero.slides[1].cta,
            href: `${STORE}tonik`,
            align: "left",
            valign: "bottom",
          },
        ]}
      />
      <BrandCategoryBar ctx={ctx} categories={bnkCategories} allLabel={c.allProducts} />
      <BrandIntro
        ctx={ctx}
        mark="/logos/bnk-dark.svg"
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
        stats={c.stats}
      />
      <RoutineFace
        ctx={ctx}
        eyebrow={c.routine.eyebrow}
        title={c.routine.title}
        description={c.routine.description}
        image="/images/bnk/model-routine.webp"
        steps={[
          {
            ...c.routine.steps[0],
            product: "/images/bnk/circle-temizleyici.webp",
            x: 55,
            y: 15,
            dx: 26,
            dy: -6,
            href: `${STORE}yuz-temizleyiciler`,
          },
          {
            ...c.routine.steps[1],
            product: "/images/bnk/circle-tonik.webp",
            x: 34,
            y: 33,
            dx: -22,
            dy: -6,
            href: `${STORE}tonik`,
          },
          {
            ...c.routine.steps[2],
            product: "/images/bnk/circle-serum.webp",
            x: 63,
            y: 40,
            dx: 20,
            dy: 14,
            href: `${STORE}cilt-serumu`,
          },
          {
            ...c.routine.steps[3],
            product: "/images/bnk/circle-gunes-kremi.webp",
            x: 45,
            y: 58,
            dx: -28,
            dy: 16,
            href: `${STORE}yuz-gunes-kremi`,
          },
        ]}
      />
      <SpecBand ctx={ctx} specs={c.specBand} icons={["sparkles", "sun-moon", "clock", "droplet"]} />
      <ProductRail
        ctx={ctx}
        eyebrow={c.bestSellers.eyebrow}
        title={c.bestSellers.title}
        products={bnkProducts}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
      />
      <Editorial
        ctx={ctx}
        image="/images/bnk/lookbook.webp"
        ratio="aspect-[16/9]"
        title={c.editorial.title}
        text={c.editorial.text}
      />
      <BlogTeasers
        ctx={ctx}
        eyebrow={c.blog.eyebrow}
        title={c.blog.title}
        soonLabel={c.blog.soon}
        posts={[
          { ...c.blog.posts[0], image: "/images/bnk/model-bb.webp" },
          { ...c.blog.posts[1], image: "/images/bnk/circle-gunes-kremi.webp" },
          { ...c.blog.posts[2], image: "/images/bnk/peeling-bej.webp" },
        ]}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
