import { useState } from "react";
import { type BrandCtx, toneStyles } from "../sections";

export type SizeItem = {
  /** İnç cinsinden boy — kataloğun kendi üç boyu: 20 / 24 / 28 */
  inch: string;
  label: string;
  /** Önerilen yolculuk süresi (rehber notu, ürün iddiası değil) */
  days: string;
  text: string;
};

/**
 * Boy rehberi — Rimowa "find the best size for your journey" kurgusunun
 * wexta karşılığı. Üç boy gerçek oranında yan yana: aynı ürün kesiti
 * 20/28, 24/28 ve 1 ölçeğinde, ortak taban çizgisine oturur. Sol listede
 * boy seçildikçe sağdaki siluet öne çıkar; diğerleri geri çekilir.
 */
export function SizeGuide({
  ctx,
  eyebrow,
  title,
  lead,
  note,
  sizes,
  set,
  image,
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  sizes: SizeItem[];
  set: { label: string; text: string };
  /** Şeffaf zeminli ürün kesiti — üç boy için aynı görsel ölçeklenir */
  image: string;
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  const [active, setActive] = useState(1);
  const max = Math.max(...sizes.map((z) => Number(z.inch)));
  /** Dizi yüksekliği; siluet kutuları bundan ve kesit oranından türetilir ki görsel kutusunu tam doldursun */
  const H = "min(520px, 60vw)";
  /** Kesitin en/boy oranı (series-wx1.webp: 708×1400) */
  const RATIO = 0.506;

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
      {/* Katalog sayfa başı: ince kural + köşe künyesi */}
      <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: s.muted }}>
        <span>{eyebrow}</span>
        <span className="h-px flex-1" style={{ background: s.cardBorder }} />
        <span>20 · 24 · 28″</span>
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <h2 className={`${ctx.font} text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl`}>{title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: s.sub }}>{lead}</p>

          <ul className="mt-10 border-t" style={{ borderColor: s.cardBorder }}>
            {sizes.map((z, i) => {
              const on = i === active;
              return (
                <li key={z.inch} className="border-b" style={{ borderColor: s.cardBorder }}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="grid w-full grid-cols-[4.5rem_1fr_auto] items-baseline gap-4 py-5 text-left outline-none"
                  >
                    <span
                      className={`${ctx.font} text-4xl font-bold leading-none tracking-tightest transition-colors md:text-5xl`}
                      style={{ color: on ? brand.color : s.fg }}
                    >
                      {z.inch}
                      <span className="text-lg align-top">″</span>
                    </span>
                    <span>
                      <span className="block font-semibold">{z.label}</span>
                      <span
                        className="block overflow-hidden text-sm leading-relaxed transition-[max-height,opacity,margin] duration-500"
                        style={{ color: s.sub, maxHeight: on ? 120 : 0, opacity: on ? 1 : 0, marginTop: on ? 6 : 0 }}
                      >
                        {z.text}
                      </span>
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors"
                      style={{
                        borderColor: on ? brand.color : s.cardBorder,
                        color: on ? brand.color : s.muted,
                      }}
                    >
                      {z.days}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 flex items-center gap-3 text-sm" style={{ color: s.muted }}>
            <span className="inline-block size-2 rounded-full" style={{ background: brand.color }} />
            <span>
              <strong className="font-semibold" style={{ color: s.fg }}>{set.label}</strong> — {set.text}
            </span>
          </p>
          <p className="mt-2 text-xs" style={{ color: s.muted }}>{note}</p>
        </div>

        {/* Oranlı siluet dizisi */}
        <div className="flex flex-col justify-end">
          <div className="relative flex items-end justify-center gap-[5%]" style={{ height: H }}>
            {sizes.map((z, i) => {
              const on = i === active;
              const scale = Number(z.inch) / max;
              return (
                <button
                  key={z.inch}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={`${z.inch}″ ${z.label}`}
                  className="group relative flex h-full items-end outline-none"
                  style={{ width: `calc(${RATIO * scale} * ${H})` }}
                >
                  <span
                    className="absolute inset-x-0 text-center text-[11px] font-semibold uppercase tracking-[0.24em] transition-all duration-500"
                    style={{
                      bottom: `calc(${scale * 100}% + 14px)`,
                      color: on ? brand.color : s.muted,
                      opacity: on ? 1 : 0.7,
                    }}
                  >
                    {z.inch}″
                  </span>
                  <img
                    src={image}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="w-full object-contain object-bottom transition-all duration-500"
                    style={{
                      height: `${scale * 100}%`,
                      opacity: on ? 1 : 0.28,
                      filter: on ? "none" : "grayscale(1)",
                      transform: on ? "translateY(0)" : "translateY(4px)",
                    }}
                  />
                </button>
              );
            })}
          </div>
          {/* Ortak taban çizgisi */}
          <div className="relative mt-3 h-px" style={{ background: s.fg }}>
            <span className="absolute -top-1 left-0 h-2 w-px" style={{ background: s.fg }} />
            <span className="absolute -top-1 right-0 h-2 w-px" style={{ background: s.fg }} />
          </div>
          <div className="mt-3 flex justify-between text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: s.muted }}>
            {sizes.map((z) => (
              <span key={z.inch}>{z.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
