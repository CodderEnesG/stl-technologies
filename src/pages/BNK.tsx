import { bnkCategories, bnkProducts, getBrand } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { BnkEditorialHero } from "../components/brand/bnkHero/BnkEditorialHero";
import {
  BlogTeasers,
  BrandCTA,
  BrandCategoryBar,
  BrandIntro,
  BrandShell,
  ProductRail,
  PullQuote,
  RoutineFace,
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
      {/* Giriş: sade editoryal kadraj (müşteri kararı, 2026-09-04) */}
      <BnkEditorialHero
        ctx={ctx}
        image="/images/bnk/hero-wide.webp"
        mobileImage="/images/bnk/hero-wide-mobile.webp"
        title={c.hero.editorialHero.title}
        sub={c.hero.editorialHero.sub}
        cta={c.hero.editorialHero.cta}
        href={`${STORE}all`}
      />
      <BrandCategoryBar ctx={ctx} categories={bnkCategories} allLabel={c.allProducts} links={c.barLinks} />
      <BrandIntro
        ctx={ctx}
        mark="/logos/bnk-dark.svg"
        kicker={c.about.kicker}
        title={c.about.title}
        body={c.about.body}
      />
      <RoutineFace
        ctx={ctx}
        id="rutin"
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
            dx: 74,
            dy: -3,
            href: `${STORE}yuz-temizleyiciler`,
          },
          {
            ...c.routine.steps[1],
            product: "/images/bnk/circle-tonik.webp",
            x: 34,
            y: 33,
            dx: -64,
            dy: -9,
            href: `${STORE}tonik`,
          },
          {
            ...c.routine.steps[2],
            product: "/images/bnk/circle-serum.webp",
            x: 63,
            y: 40,
            dx: 66,
            dy: 14,
            href: `${STORE}cilt-serumu`,
          },
          {
            ...c.routine.steps[3],
            product: "/images/bnk/circle-gunes-kremi.webp",
            x: 45,
            y: 58,
            dx: -75,
            dy: 16,
            href: `${STORE}yuz-gunes-kremi`,
          },
        ]}
      />
      <ProductRail
        ctx={ctx}
        id="en-cok-satanlar"
        eyebrow={c.bestSellers.eyebrow}
        title={c.bestSellers.title}
        products={bnkProducts}
        prevLabel={c.hero.prev}
        nextLabel={c.hero.next}
        badges={c.bestSellers.badges}
        viewLabel={c.bestSellers.view}
      />
      <BlogTeasers
        ctx={ctx}
        id="blog"
        eyebrow={c.blog.eyebrow}
        title={c.blog.title}
        soonLabel={c.blog.soon}
        posts={[
          { ...c.blog.posts[0], image: "/images/bnk/blog-rutin.webp" },
          { ...c.blog.posts[1], image: "/images/bnk/blog-spf.webp" },
          { ...c.blog.posts[2], image: "/images/bnk/blog-nem.webp" },
        ]}
      />
      <PullQuote ctx={ctx} text={c.quote.text} source={c.quote.source} />
      <BrandCTA ctx={ctx} title={c.ctaTitle} channel={c.channel} />
    </BrandShell>
  );
}
