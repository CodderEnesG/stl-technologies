import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { brands } from "../../data/brands";
import { useI18n } from "../../i18n";
import { Arrow } from "../Arrow";
import { LogoSlot } from "../LogoSlot";

const ROTATE_MS = 6000;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * V2 — Cinematic Showcase: tam ekran tek marka sahnesi, otomatik rotasyon.
 * Altta 4 marka sekmesi + ilerleme çizgisi. Hover'da rotasyon durur.
 */
export function HeroShowcase() {
  const { t, p } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // progress animasyonunu resetlemek için
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => {
    setIndex(i % brands.length);
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    if (reducedMotion()) return;
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % brands.length);
      setTick((n) => n + 1);
    }, ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const b = brands[index];
  const copy = t.brands[b.slug as keyof typeof t.brands];
  const onDark = b.panelText === "#ffffff";

  return (
    <section
      className="relative flex h-[calc(100svh-var(--nav-h))] min-h-[560px] flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sahne */}
      {brands.map((bb, i) => (
        <div
          key={bb.slug}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ background: bb.panelBg, opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        />
      ))}

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 px-5 md:grid-cols-2 md:px-8" style={{ color: b.panelText }}>
        <div>
          <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">
            <span className="size-2 rounded-full" style={{ background: b.color }} />
            {t.brandPage.stlBrandBadge}
          </span>
          <div className="mt-2">
            <LogoSlot src={onDark ? b.logoLight : b.logoDark} label={b.name} height={56} onDark={onDark} />
          </div>
          <p className="mt-6 max-w-md text-2xl font-medium leading-snug md:text-3xl">{copy.tagline}</p>
          <Link
            to={p[b.slug as keyof typeof p]}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold shadow-lg transition-transform hover:translate-x-1"
            style={{ background: b.color, color: b.onColor }}
          >
            {t.home.discoverBrand} <Arrow />
          </Link>
        </div>
        <div className="relative hidden h-[70%] md:block">
          {brands.map((bb, i) => (
            <img
              key={bb.slug}
              src={bb.hero}
              alt=""
              aria-hidden={i !== index}
              className="absolute inset-0 size-full object-contain object-center transition-all duration-700"
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? "scale(1)" : "scale(0.96)",
                mixBlendMode: bb.heroBlend ? "multiply" : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Sekmeler */}
      <div className="relative z-10 border-t border-black/10" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
        <div className="mx-auto grid max-w-[1400px] grid-cols-4">
          {brands.map((bb, i) => {
            const active = i === index;
            return (
              <button
                key={bb.slug}
                onClick={() => go(i)}
                className="relative px-3 py-4 text-left transition-opacity md:px-6 md:py-5"
                style={{ color: b.panelText, opacity: active ? 1 : 0.55 }}
                aria-current={active}
              >
                <span className="block font-expanded text-sm font-extrabold uppercase tracking-tightest md:text-lg">{bb.name}</span>
                <span className="mt-0.5 hidden text-xs opacity-70 md:block">
                  {t.brands[bb.slug as keyof typeof t.brands].summary}
                </span>
                <span className="absolute inset-x-0 top-0 h-0.5 bg-current opacity-20" />
                {active && !reducedMotion() && (
                  <span
                    key={tick}
                    className="absolute left-0 top-0 h-0.5"
                    style={{
                      background: bb.color,
                      animation: paused ? "none" : `hero-progress ${ROTATE_MS}ms linear forwards`,
                      width: paused ? "100%" : undefined,
                    }}
                  />
                )}
                {active && reducedMotion() && (
                  <span className="absolute left-0 top-0 h-0.5 w-full" style={{ background: bb.color }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
