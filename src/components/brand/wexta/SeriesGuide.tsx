import { useState } from "react";
import { Link } from "react-router";
import type { WextaSeries } from "../../../data/brands";
import { useI18n } from "../../../i18n";
import { Arrow } from "../../Arrow";
import { type BrandCtx, toneStyles } from "../sections";

export type SeriesCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  colorsLabel: (n: number) => string;
  sizesLabel: string;
  sizesValue: string;
  kidsSize: string;
  materialLabel: string;
  material: Record<WextaSeries["material"], string>;
  productCta: string;
  quoteCta: string;
  /** Seri koduna göre ad + tek cümle */
  items: Record<string, { name: string; text: string }>;
};

/**
 * Seri rehberi — Rimowa "size guide by collection" sekmelerinin wexta
 * karşılığı. Üstte seri kodları ince kurallı şerit; altta seçili serinin
 * katalog kesiti solda, sağda ad, tek cümle ve teknik satırlar. Görseller
 * kataloğun kendi çekimleri; jpg olanlar multiply ile beyaza kaynaşır.
 */
export function SeriesGuide({ ctx, copy, series }: { ctx: BrandCtx; copy: SeriesCopy; series: WextaSeries[] }) {
  const { s: sec } = useI18n();
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  const [active, setActive] = useState(0);
  const cur = series[active];
  const txt = copy.items[cur.code];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
      <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: s.muted }}>
        <span>{copy.eyebrow}</span>
        <span className="h-px flex-1" style={{ background: s.cardBorder }} />
        <span className="tabular-nums">
          {pad(active + 1)} / {pad(series.length)}
        </span>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
        <h2 className={`${ctx.font} text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl`}>{copy.title}</h2>
        <p className="max-w-md text-lg leading-relaxed md:justify-self-end" style={{ color: s.sub }}>{copy.lead}</p>
      </div>

      {/* Seri şeridi */}
      <div className="-mx-5 mt-10 overflow-x-auto px-5 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
        <div
          className="grid min-w-[720px] gap-3 md:min-w-0 md:gap-4"
          style={{ gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))` }}
          role="tablist"
        >
          {series.map((sr, i) => {
            const on = i === active;
            return (
              <button
                key={sr.code}
                type="button"
                role="tab"
                aria-selected={on}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group text-left outline-none"
              >
                <span
                  className="block h-px w-full transition-all duration-300"
                  style={{ background: on ? brand.color : s.cardBorder, boxShadow: on ? `0 1px 0 ${brand.color}` : undefined }}
                />
                <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: on ? s.fg : s.muted }}>
                  {sr.code}
                </span>
                <span className="mt-0.5 block truncate text-sm font-semibold" style={{ color: on ? brand.color : s.sub }}>
                  {copy.items[sr.code]?.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-16">
        {/* Ürün kesiti — çapraz geçiş */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[10%] bottom-[6%] h-[10%] rounded-[50%] blur-2xl"
            style={{ background: `${brand.color}2e` }}
          />
          {series.map((sr, i) => (
            <img
              key={sr.code}
              src={sr.image}
              alt={`${sr.code} ${copy.items[sr.code]?.name ?? ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 size-full object-contain transition-opacity duration-500"
              style={{ opacity: i === active ? 1 : 0, mixBlendMode: sr.blend ? "multiply" : undefined }}
            />
          ))}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: brand.color }}>
            {cur.code}
            {cur.kids ? "" : " · " + copy.sizesValue}
          </p>
          <h3 className={`mt-3 ${ctx.font} text-4xl font-bold leading-[1.02] tracking-tightest md:text-6xl`}>{txt?.name}</h3>
          <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: s.sub }}>{txt?.text}</p>

          <dl className="mt-8 divide-y border-y" style={{ borderColor: s.cardBorder }}>
            <div className="grid grid-cols-[7rem_1fr] items-center gap-4 py-3.5" style={{ borderColor: s.cardBorder }}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: s.muted }}>
                {copy.colorsLabel(cur.colorCount)}
              </dt>
              <dd className="flex flex-wrap items-center gap-2">
                {cur.colors.map((cc) => (
                  <span key={cc} className="size-4 rounded-full ring-1 ring-black/10" style={{ background: cc }} />
                ))}
                {cur.colorCount > cur.colors.length && (
                  <span className="text-xs" style={{ color: s.muted }}>+{cur.colorCount - cur.colors.length}</span>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] items-center gap-4 py-3.5" style={{ borderColor: s.cardBorder }}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: s.muted }}>{copy.sizesLabel}</dt>
              <dd className="font-semibold">{cur.kids ? copy.kidsSize : copy.sizesValue}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] items-center gap-4 py-3.5" style={{ borderColor: s.cardBorder }}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: s.muted }}>{copy.materialLabel}</dt>
              <dd className="font-semibold">{copy.material[cur.material]}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {cur.href && (
              <a
                href={cur.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-transform hover:scale-[1.02]"
                style={{ background: brand.color, color: brand.onColor }}
              >
                {copy.productCta} <Arrow />
              </a>
            )}
            <Link
              to={sec("contact")}
              className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition-colors ${cur.href ? "" : ""}`}
              style={cur.href ? { borderColor: s.cardBorder, color: s.fg } : { background: brand.color, borderColor: brand.color, color: brand.onColor }}
            >
              {copy.quoteCta} <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
