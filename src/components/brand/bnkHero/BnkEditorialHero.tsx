import { Arrow } from "../../Arrow";
import { toneStyles, type BrandCtx } from "../sections";

/**
 * Sade giriş varyantı: solda model portresi, sağda tek cümlelik söylem.
 * Referans dili beautyofjoseon.com — kampanya banner'ı yerine editoryal kadraj.
 */
export function BnkEditorialHero({
  ctx,
  image,
  title,
  sub,
  cta,
  href,
}: {
  ctx: BrandCtx;
  image: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
}) {
  const s = toneStyles[ctx.tone];
  return (
    <section className="relative overflow-hidden" style={{ background: "#ffffff", color: s.fg }}>
      <div className="mx-auto grid max-w-[1600px] items-stretch md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[560px]">
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: "50% 22%" }}
          />
        </div>
        <div className="flex flex-col justify-center gap-6 px-6 py-14 md:px-14 md:py-20">
          <h1 className={`${ctx.font} text-4xl font-bold leading-[1.05] tracking-tightest md:text-6xl`}>{title}</h1>
          <p className="max-w-md text-lg leading-relaxed" style={{ color: s.sub }}>{sub}</p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: ctx.brand.color, color: ctx.brand.onColor }}
          >
            {cta}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
