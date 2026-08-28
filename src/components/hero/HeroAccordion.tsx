import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { brands } from "../../data/brands";
import { useI18n } from "../../i18n";
import { Arrow } from "../Arrow";
import { LogoSlot } from "../LogoSlot";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const touchOnly = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

/**
 * V1 — Accordion: 4 dikey panel; hover/focus'ta aktif panel büyür.
 * Boşta 5 sn'de bir sıradaki panel "nefes alır"; etkileşimle durur.
 */
export function HeroAccordion() {
  const { t, p } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const [idle, setIdle] = useState(0);
  const interacted = useRef(false);

  useEffect(() => {
    if (reducedMotion()) return;
    const id = setInterval(() => {
      if (!interacted.current) setIdle((i) => (i + 1) % brands.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const shown = active ?? idle;

  const handleTouchNav = (i: number) => (e: React.MouseEvent) => {
    if (touchOnly() && active !== i) {
      e.preventDefault();
      interacted.current = true;
      setActive(i);
    }
  };

  return (
    <section
      className="relative flex h-[calc(100svh-var(--nav-h))] min-h-[560px] w-full flex-col md:flex-row"
      onMouseLeave={() => {
        setActive(null);
        interacted.current = false;
      }}
    >
      {brands.map((b, i) => {
        const isActive = shown === i;
        const copy = t.brands[b.slug as keyof typeof t.brands];
        const grow = active === i ? 3.2 : active === null && idle === i ? 1.35 : 1;
        return (
          <Link
            key={b.slug}
            to={p[b.slug as keyof typeof p]}
            onMouseEnter={() => {
              interacted.current = true;
              setActive(i);
            }}
            onFocus={() => {
              interacted.current = true;
              setActive(i);
            }}
            onClick={handleTouchNav(i)}
            className="group relative overflow-hidden border-b border-black/10 outline-none transition-[flex-grow] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/70 md:border-b-0 md:border-r"
            style={{
              flexGrow: grow,
              flexBasis: 0,
              background: b.panelBg,
              color: b.panelText,
            }}
            aria-current={active === i ? "true" : undefined}
          >
            <img
              src={b.hero}
              alt=""
              aria-hidden
              fetchPriority={i === 0 ? "high" : undefined}
              className={
                b.heroBlend
                  ? "absolute bottom-0 left-1/2 h-[62%] -translate-x-1/2 object-contain object-bottom transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-[68%]"
                  : "absolute bottom-0 left-0 h-[58%] w-full object-cover object-center transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-[64%]"
              }
              style={{
                filter: isActive ? "none" : "saturate(0.85)",
                mixBlendMode: b.heroBlend ? "multiply" : undefined,
                opacity: b.heroBlend ? 1 : 0.92,
                maskImage: b.heroBlend ? undefined : "linear-gradient(to bottom, transparent, #000 18%)",
                WebkitMaskImage: b.heroBlend ? undefined : "linear-gradient(to bottom, transparent, #000 18%)",
              }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.28) 100%)",
                opacity: active === i ? 0 : 0.55,
              }}
            />

            {/* Kapalı hâl: dikey marka adı */}
            <span
              className="absolute left-1/2 top-10 hidden -translate-x-1/2 whitespace-nowrap font-expanded text-2xl font-extrabold uppercase tracking-tightest transition-opacity duration-300 md:block"
              style={{ opacity: active === i ? 0 : 1, writingMode: "vertical-rl" }}
            >
              {b.name}
            </span>

            {/* Açık hâl */}
            <div
              className="absolute inset-x-0 bottom-0 p-6 transition-all duration-500 md:p-8"
              style={{
                opacity: active === i ? 1 : 0,
                transform: active === i ? "translateY(0)" : "translateY(16px)",
                pointerEvents: active === i ? "auto" : "none",
              }}
            >
              <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">
                <span className="size-2 rounded-full" style={{ background: b.color }} />
                0{i + 1}
              </span>
              <LogoSlot
                src={b.panelText === "#ffffff" ? b.logoLight : b.logoDark}
                label={b.name}
                height={40}
                className="mb-4"
                onDark={b.panelText === "#ffffff"}
              />
              <p className="mt-1 max-w-sm text-lg font-medium">{copy.tagline}</p>
              <span
                className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform group-hover:translate-x-1"
                style={{ background: b.color, color: b.onColor }}
              >
                {t.home.discoverBrand}
                <Arrow />
              </span>
            </div>

            {/* Mobil kapalı hâl: yatay ad */}
            <div
              className="absolute inset-x-0 bottom-0 p-5 md:hidden"
              style={{ opacity: active === i ? 0 : 1 }}
            >
              <h2 className="font-expanded text-3xl font-black uppercase leading-none tracking-tightest">{b.name}</h2>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
