import { Arrow } from "../../Arrow";
import { toneStyles, type BrandCtx } from "../sections";

/**
 * BNK girişi: portre tüm bandı kaplar (hero-wide.webp — fotoğrafın zemini sağa
 * doğru uzatıldı), söylem sağ yarıda görselin üstünde durur. Dar ekranda
 * dikey kadraj üstte, metin altta.
 */
export function BnkEditorialHero({
  ctx,
  image,
  mobileImage,
  title,
  sub,
  cta,
  href,
}: {
  ctx: BrandCtx;
  image: string;
  mobileImage?: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
}) {
  const s = toneStyles[ctx.tone];
  return (
    <section className="relative overflow-hidden" style={{ background: "#fdfaf8", color: s.fg }}>
      {/* Masaüstü: tam genişlik arka plan */}
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 hidden size-full object-cover object-left md:block"
      />
      {/* Mobil: dikey kadraj */}
      <img src={mobileImage ?? image} alt="" aria-hidden className="aspect-square w-full object-cover object-left-top md:hidden" />

      <div className="relative mx-auto grid max-w-[1600px] md:min-h-[600px] md:grid-cols-2 lg:min-h-[660px]">
        <div className="hidden md:block" />
        <div className="flex flex-col justify-center gap-6 px-6 py-12 md:px-14 md:py-20 lg:pl-20">
          <h1 className={`${ctx.font} max-w-xl text-4xl font-bold leading-[1.05] tracking-tightest md:text-6xl`}>{title}</h1>
          <p className="max-w-md text-lg leading-relaxed" style={{ color: s.sub }}>{sub}</p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
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
