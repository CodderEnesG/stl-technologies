import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { BrandHeroSlideshow, type BrandCtx } from "../sections";
import { BnkEditorialHero } from "./BnkEditorialHero";

const VARIANTS = ["1", "2"] as const;
type Variant = (typeof VARIANTS)[number];
const STORAGE_KEY = "bnk-hero-variant";

const labels: Record<Variant, string> = {
  "1": "Mağaza banner'ı",
  "2": "Sade editoryal",
};

/**
 * BNK giriş varyant seçici — müşteri kararı için.
 * ?bhero=1..2 ile veya sağ alttaki mini seçiciyle gezilir; seçim localStorage'da kalır.
 * Karar netleşince kaybeden varyant silinir.
 */
export function BnkHero({
  ctx,
  slides,
  editorial,
  prevLabel,
  nextLabel,
}: {
  ctx: BrandCtx;
  slides: React.ComponentProps<typeof BrandHeroSlideshow>["slides"];
  editorial: { image: string; title: string; sub: string; cta: string; href: string };
  prevLabel: string;
  nextLabel: string;
}) {
  const [params, setParams] = useSearchParams();
  const fromQuery = params.get("bhero");
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
    params.set("bhero", v);
    setParams(params, { replace: true });
  };

  return (
    <>
      {variant === "1" && (
        <BrandHeroSlideshow ctx={ctx} slides={slides} prevLabel={prevLabel} nextLabel={nextLabel} />
      )}
      {variant === "2" && <BnkEditorialHero ctx={ctx} {...editorial} />}

      <div className="fixed bottom-4 right-4 z-[90] flex items-center gap-1 rounded-full border border-[#ffdbe6] bg-white/90 p-1 shadow-lg backdrop-blur">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => pick(v)}
            title={labels[v]}
            className="grid size-8 place-items-center rounded-full text-xs font-bold transition-colors"
            style={variant === v ? { background: ctx.brand.color, color: ctx.brand.onColor } : { color: "#6b5b60" }}
          >
            {v}
          </button>
        ))}
      </div>
    </>
  );
}
