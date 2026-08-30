import { company } from "../data/company";
import { useI18n } from "../i18n";
import { WORLD_VIEWBOX, worldPaths } from "../data/worldPaths";
import { toneStyles, type BrandCtx } from "./brand/sections";

/**
 * İhracat haritası — bağımlılıksız, inline SVG.
 * Ülke şekilleri src/data/worldPaths.ts içinde statik; işaretlenecek pazarlar
 * company.exportMarkets dizisinden (ISO 3166-1 alpha-2) okunur.
 */
export function ExportMap({ ctx }: { ctx: BrandCtx }) {
  const { t } = useI18n();
  const s = toneStyles[ctx.tone];
  const m = t.home.exportMap;
  const accent = ctx.brand.color;
  const markets = new Set(company.exportMarkets);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: accent }}>
            {m.kicker}
          </p>
          <div className="mt-5 flex items-baseline gap-4">
            <span className="font-expanded text-7xl leading-none tracking-tightest" style={{ color: accent }}>
              {String(company.exportCountries)}
            </span>
            <span className={`${ctx.font} text-xl font-semibold leading-tight tracking-tightest`}>{m.unit}</span>
          </div>
          <h2 className={`mt-6 max-w-md ${ctx.font} text-2xl font-bold leading-[1.15] tracking-tightest md:text-3xl`}>
            {m.title}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed" style={{ color: s.sub }}>
            {m.body}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm" style={{ color: s.muted }}>
            <Legend color="#2b2828" label={m.legendHome} />
            <Legend color={accent} label={m.legendMarket} />
          </div>
        </div>

        <figure className="min-w-0">
          <svg
            viewBox={WORLD_VIEWBOX}
            role="img"
            aria-label={m.alt}
            className="w-full"
            style={{ overflow: "visible" }}
          >
            {Object.entries(worldPaths).map(([code, d]) => {
              const home = code === "TR";
              const market = markets.has(code);
              return (
                <path
                  key={code}
                  d={d}
                  fill={home ? "#2b2828" : market ? accent : "#dedbdb"}
                  stroke={s.bg}
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>
          {markets.size === 0 && (
            <figcaption className="mt-4 text-xs" style={{ color: s.muted }}>
              {m.pendingNote}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="size-3 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}
