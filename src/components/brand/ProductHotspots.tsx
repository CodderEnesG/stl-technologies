import { useState } from "react";
import { toneStyles, type BrandCtx } from "./sections";
import { SectionHeader } from "../SectionHeader";

export type Hotspot = {
  title: string;
  text: string;
  /** Görsel üzerindeki konum, yüzde */
  x: number;
  y: number;
};

/**
 * Ürün ortada, özellikler görselin üzerindeki noktalardan açılır.
 * Markadan bağımsız: Oxyra koltuğunda da wexta valizinde de aynı bileşen kullanılır.
 * Hover / tık / klavye focus ile çalışır; mobilde kartlar görselin altında listelenir.
 */
export function ProductHotspots({
  ctx,
  eyebrow,
  title,
  hint,
  image,
  hotspots,
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  /** Başlık altındaki kısa yönerge — verilmezse gösterilmez */
  hint?: string;
  image: string;
  hotspots: Hotspot[];
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  const [active, setActive] = useState(0);
  // Koyu zeminde beyaz cam nokta okunuyor; açık zeminde markanın kendi rengi gerekiyor.
  const onDark = ctx.tone === "dark";
  const dotIdle = onDark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.9)";
  const dotIdleBorder = onDark ? "rgba(255,255,255,0.5)" : brand.color;

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={hint}
        onDark={ctx.tone === "dark"}
        eyebrowColor={brand.color}
        descriptionColor={s.sub}
        titleFont={ctx.font}
        className="mb-12"
      />

      <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-14">
        {/* Görsel + noktalar */}
        <div className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-2xl">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[12%] bottom-[4%] h-[8%] rounded-[50%] blur-2xl"
            style={{ background: `${brand.color}2e` }}
          />
          <img src={image} alt="" aria-hidden className="relative w-full object-contain" />

          {hotspots.map((h, i) => {
            const on = active === i;
            return (
              <button
                key={h.title}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={h.title}
                aria-pressed={on}
                className="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none transition-transform duration-300 hover:scale-110 focus-visible:ring-4 focus-visible:ring-white/40 md:size-9"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  background: on ? brand.color : dotIdle,
                  border: `1.5px solid ${on ? brand.color : dotIdleBorder}`,
                  backdropFilter: "blur(4px)",
                  boxShadow: onDark ? undefined : "0 6px 18px -6px rgba(0,0,0,0.35)",
                }}
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: on ? 10 : 7,
                    height: on ? 10 : 7,
                    background: on ? brand.onColor : "#fff",
                  }}
                />
                {on && (
                  <span
                    aria-hidden
                    className="hotspot-ping absolute inset-0 rounded-full"
                    style={{ border: `1.5px solid ${brand.color}` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Özellik listesi — çerçeveli kart yerine ince çizgi, aktif satırda marka rengi */}
        <ol className="border-t" style={{ borderColor: s.cardBorder }}>
          {hotspots.map((h, i) => {
            const on = active === i;
            return (
              <li
                key={h.title}
                className="border-b border-l-2 transition-colors duration-300"
                style={{ borderBottomColor: s.cardBorder, borderLeftColor: on ? brand.color : "transparent" }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="flex w-full gap-5 py-5 pl-5 text-left outline-none focus-visible:ring-2 md:py-6"
                >
                  <span
                    className="w-6 shrink-0 pt-1 text-xs font-bold tabular-nums"
                    style={{ color: on ? brand.color : s.muted }}
                  >
                    0{i + 1}
                  </span>
                  <span>
                    <span className={`${ctx.font} block text-lg font-bold tracking-tightest`}>{h.title}</span>
                    <span
                      className="mt-1.5 block leading-relaxed transition-opacity duration-300"
                      style={{ color: s.sub, opacity: on ? 1 : 0.55 }}
                    >
                      {h.text}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
