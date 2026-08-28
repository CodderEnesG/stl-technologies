import { useState } from "react";
import { Link } from "react-router";
import { brands } from "../../data/brands";
import { useI18n } from "../../i18n";
import { Arrow } from "../Arrow";

/**
 * V4 — Tipografik Liste: dev marka isimleri alt alta; hover'da sağ panelde
 * marka görseli + rengi cross-fade. Editoryal / ödül sitesi dili.
 */
export function HeroList() {
  const { t, p } = useI18n();
  const [active, setActive] = useState(0);
  const b = brands[active];

  return (
    <section className="mx-auto grid max-w-[1400px] gap-6 px-5 py-8 md:h-[calc(100svh-var(--nav-h))] md:min-h-[560px] md:grid-cols-[1.2fr_1fr] md:items-stretch md:px-8">
      {/* Liste */}
      <div className="flex flex-col justify-center">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
          {t.home.introEyebrow} — {t.home.portfolioTitle}
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {brands.map((bb, i) => {
            const copy = t.brands[bb.slug as keyof typeof t.brands];
            const isActive = active === i;
            return (
              <li key={bb.slug}>
                <Link
                  to={p[bb.slug as keyof typeof p]}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center justify-between gap-4 py-5 outline-none md:py-7"
                >
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    <span
                      className="font-expanded text-4xl font-black uppercase leading-none tracking-tightest transition-colors duration-300 md:text-7xl"
                      style={{ color: isActive ? bb.color : "var(--foreground)" }}
                    >
                      {bb.name}
                    </span>
                  </span>
                  <span className="hidden max-w-[24ch] text-right text-sm text-muted md:block">{copy.summary}</span>
                  <span
                    className="shrink-0 transition-all duration-300 md:opacity-0 md:group-hover:translate-x-1 md:group-hover:opacity-100"
                    style={{ color: bb.color }}
                  >
                    <Arrow />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">{t.home.introText}</p>
      </div>

      {/* Görsel panel */}
      <div className="relative hidden overflow-hidden rounded-3xl md:block">
        {brands.map((bb, i) => (
          <div
            key={bb.slug}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: bb.panelBg, opacity: active === i ? 1 : 0 }}
            aria-hidden={active !== i}
          >
            <img
              src={bb.hero}
              alt=""
              aria-hidden
              loading={i === 0 ? undefined : "lazy"}
              className="absolute inset-x-6 bottom-0 mx-auto h-[78%] object-contain object-bottom"
              style={{ mixBlendMode: bb.heroBlend ? "multiply" : undefined }}
            />
          </div>
        ))}
        <div className="absolute bottom-0 left-0 p-7" style={{ color: b.panelText }}>
          <p className="text-lg font-medium">{t.brands[b.slug as keyof typeof t.brands].tagline}</p>
        </div>
      </div>
    </section>
  );
}
