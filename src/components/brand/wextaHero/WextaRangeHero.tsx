import { useState } from "react";
import { wextaProducts } from "../../../data/brands";
import { useI18n } from "../../../i18n";
import { Arrow } from "../../Arrow";
import { type BrandCtx } from "../sections";

/**
 * V3 — Ürün gamı hero'su.
 * wexta'nın katalog dili: beyaz sayfa, ince kurallar, majüskül mikro tipografi.
 * Sağda seçili valiz büyük durur; altındaki model şeridinden geçildikçe fotoğraf
 * çapraz geçişle değişir. Stok fotoğraf yok — hepsi gerçek ürün çekimi.
 */
export function WextaRangeHero({ ctx, channelHref }: { ctx: BrandCtx; channelHref: string }) {
  const { t } = useI18n();
  const c = t.brands.wexta;
  const h = c.heroAlt;
  const [active, setActive] = useState(0);
  const models = wextaProducts.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-14 pt-16 md:min-h-[calc(100svh-var(--nav-h))] md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-16 md:px-8 md:pb-16">
        <div>
          <p
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: ctx.brand.color }}
          >
            <span className="h-px w-8" style={{ background: ctx.brand.color }} />
            {h.label}
          </p>

          <img src="/logos/wexta.svg" alt="wexta" className="mt-7 h-8 w-auto object-contain md:h-9" />

          <h1 className={`mt-6 ${ctx.font} text-4xl font-bold leading-[1.06] tracking-tightest md:text-6xl`}>
            {h.title}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#5c6266]">{h.lead}</p>

          <a
            href={channelHref}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-transform hover:scale-[1.02]"
            style={{ background: ctx.brand.color, color: ctx.brand.onColor }}
          >
            {h.cta} <Arrow />
          </a>
        </div>

        <div>
          {/* Seçili ürün — hepsi aynı kadrajda, çapraz geçişle değişir */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[640px]">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 blur-3xl"
              style={{ background: `radial-gradient(circle at 50% 60%, ${ctx.brand.color}33, transparent 66%)` }}
            />
            {models.map((m, i) => (
              <img
                key={m.name}
                src={m.image}
                alt={m.name}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 size-full object-contain transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0, mixBlendMode: "multiply" }}
              />
            ))}
          </div>

          {/* Model şeridi */}
          <div
            className="mt-8 grid gap-3 md:gap-5"
            style={{ gridTemplateColumns: `repeat(${models.length}, minmax(0, 1fr))` }}
          >
            {models.map((m, i) => (
              <button
                key={m.name}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className="group text-left outline-none"
              >
                <span
                  className="block h-px w-full transition-all duration-300"
                  style={{
                    background: i === active ? ctx.brand.color : "#e8eaeb",
                    boxShadow: i === active ? `0 1px 0 ${ctx.brand.color}` : undefined,
                  }}
                />
                <span className="mt-3 flex items-center gap-2">
                  {m.colors?.slice(0, 3).map((col) => (
                    <span
                      key={col}
                      className="size-2.5 rounded-full ring-1 ring-black/10"
                      style={{ background: col }}
                    />
                  ))}
                </span>
                <span
                  className="mt-2 block text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
                  style={{ color: i === active ? "#17181a" : "#8a9093" }}
                >
                  {m.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
