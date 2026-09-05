import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { wextaImages } from "../../../data/brands";
import { type BrandCtx } from "../sections";
import { WextaSlider } from "../WextaSlider";
import { WextaCoverHero } from "./WextaCoverHero";
import { WextaRangeHero } from "./WextaRangeHero";

const VARIANTS = ["1", "2", "3", "4"] as const;
type Variant = (typeof VARIANTS)[number];
const STORAGE_KEY = "wexta-hero-variant";

const labels: Record<Variant, string> = {
  "1": "Slider",
  "2": "Katalog kapağı",
  "3": "Ürün gamı",
  "4": "Katalog kapağı (siyah-beyaz)",
};

/**
 * wexta hero varyant seçici — müşteri kararı için. Müşteri 2'yi beğendi (2026-09-05), varsayılan 2;
 * diğer ikisi karşılaştırma için duruyor.
 * ?whero=1..4 ile veya sağ alttaki mini seçiciyle gezilir; seçim localStorage'da kalır.
 * Karar netleşince kalan varyantlar silinir ve seçilen doğrudan render edilir.
 */
export function WextaHero({ ctx, channelHref }: { ctx: BrandCtx; channelHref: string }) {
  const [params, setParams] = useSearchParams();
  const fromQuery = params.get("whero");
  const [variant, setVariant] = useState<Variant>(() => {
    if (fromQuery && (VARIANTS as readonly string[]).includes(fromQuery)) return fromQuery as Variant;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && (VARIANTS as readonly string[]).includes(stored) ? (stored as Variant) : "2";
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
    params.set("whero", v);
    setParams(params, { replace: true });
  };

  return (
    <>
      {variant === "1" && <WextaSlider channelHref={channelHref} />}
      {variant === "2" && <WextaCoverHero ctx={ctx} channelHref={channelHref} />}
      {variant === "3" && <WextaRangeHero ctx={ctx} channelHref={channelHref} />}
      {variant === "4" && <WextaCoverHero ctx={ctx} channelHref={channelHref} image={wextaImages.coverMono} focus="50% 62%" />}

      <div className="fixed bottom-4 right-4 z-[90] flex items-center gap-1 rounded-full border border-[#e8eaeb] bg-white/90 p-1 shadow-lg backdrop-blur">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => pick(v)}
            title={labels[v]}
            className="grid size-8 place-items-center rounded-full text-xs font-bold transition-colors"
            style={
              variant === v
                ? { background: ctx.brand.color, color: ctx.brand.onColor }
                : { color: "#8a9093" }
            }
          >
            {v}
          </button>
        ))}
      </div>
    </>
  );
}
