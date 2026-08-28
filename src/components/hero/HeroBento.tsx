import { Link } from "react-router";
import { brands, stlImages } from "../../data/brands";
import { useI18n } from "../../i18n";
import { Arrow } from "../Arrow";
import { LogoSlot } from "../LogoSlot";

/**
 * V3 — Kurumsal Bento: sol büyük STL üretim bloğu (gerçek istatistikler),
 * sağda 2x2 marka kartı. En sakin, en kurumsal varyant.
 */
export function HeroBento() {
  const { t, p } = useI18n();
  return (
    <section className="mx-auto grid max-w-[1400px] gap-4 px-5 py-6 md:h-[calc(100svh-var(--nav-h))] md:min-h-[560px] md:grid-cols-[1.1fr_1fr] md:px-8">
      {/* STL bloğu */}
      <div className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-3xl">
        <img
          src={stlImages.factory}
          alt={t.about.facilityAlt}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="relative p-7 text-white md:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">{t.home.introEyebrow}</p>
          <h1 className="mt-3 max-w-lg font-display text-3xl font-bold leading-[1.08] tracking-tightest md:text-[2.6rem]">
            {t.home.introText}
          </h1>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            {t.home.stats.map((s) => (
              <div key={s.l}>
                <div className="font-expanded text-2xl font-extrabold tracking-tightest md:text-3xl">{s.n}</div>
                <div className="mt-0.5 text-xs text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marka kartları */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {brands.map((b) => {
          const copy = t.brands[b.slug as keyof typeof t.brands];
          const onDark = b.panelText === "#ffffff";
          return (
            <Link
              key={b.slug}
              to={p[b.slug as keyof typeof p]}
              className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-3xl p-5 outline-none transition-transform hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-[var(--accent)]/40 md:p-6"
              style={{ background: b.panelBg, color: b.panelText }}
            >
              <img
                src={b.hero}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute -bottom-2 -right-2 h-[68%] w-[62%] object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                style={{ mixBlendMode: b.heroBlend ? "multiply" : undefined, opacity: b.heroBlend ? 1 : 0.9 }}
              />
              <div
                className="absolute inset-0 opacity-40"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent 55%)" }}
              />
              <div className="relative">
                <LogoSlot
                  src={onDark ? (b.logoLightWide ?? b.logoLight) : (b.logoDarkWide ?? b.logoDark)}
                  label={b.name}
                  height={22}
                  onDark={onDark}
                />
              </div>
              <div className="relative flex items-end justify-between gap-2">
                <p className="max-w-[16ch] text-sm font-medium leading-snug">{copy.tagline}</p>
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-0.5"
                  style={{ background: b.color, color: b.onColor }}
                >
                  <Arrow />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
