import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { HeroAccordion } from "./HeroAccordion";
import { HeroShowcase } from "./HeroShowcase";
import { HeroBento } from "./HeroBento";
import { HeroList } from "./HeroList";

const VARIANTS = ["1", "2", "3", "4"] as const;
type Variant = (typeof VARIANTS)[number];
const STORAGE_KEY = "stl-hero-variant";

const labels: Record<Variant, string> = {
  "1": "Accordion",
  "2": "Showcase",
  "3": "Bento",
  "4": "Liste",
};

/**
 * Hero varyant seçici — müşteri demo aşaması için.
 * ?hero=1..4 ile veya sağ alttaki mini seçiciyle gezilir; seçim localStorage'da kalır.
 * Karar netleşince: kalan varyantlar silinir, Hero doğrudan seçileni render eder.
 */
export function Hero() {
  const [params, setParams] = useSearchParams();
  const fromQuery = params.get("hero");
  const [variant, setVariant] = useState<Variant>(() => {
    if (fromQuery && (VARIANTS as readonly string[]).includes(fromQuery)) return fromQuery as Variant;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && (VARIANTS as readonly string[]).includes(stored) ? (stored as Variant) : "1";
  });

  useEffect(() => {
    if (fromQuery && (VARIANTS as readonly string[]).includes(fromQuery) && fromQuery !== variant) {
      setVariant(fromQuery as Variant);
    }
  }, [fromQuery, variant]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, variant);
  }, [variant]);

  const pick = (v: Variant) => {
    setVariant(v);
    params.set("hero", v);
    setParams(params, { replace: true });
  };

  return (
    <>
      {variant === "1" && <HeroAccordion />}
      {variant === "2" && <HeroShowcase />}
      {variant === "3" && <HeroBento />}
      {variant === "4" && <HeroList />}

      <div className="fixed bottom-4 right-4 z-[90] flex items-center gap-1 rounded-full border border-border bg-white/90 p-1 shadow-lg backdrop-blur">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => pick(v)}
            title={labels[v]}
            className={`grid size-8 place-items-center rounded-full text-xs font-bold transition-colors ${
              variant === v ? "bg-[var(--accent)] text-white" : "text-muted hover:bg-black/5"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </>
  );
}
