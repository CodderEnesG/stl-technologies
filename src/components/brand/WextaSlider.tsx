import { useEffect, useState } from "react";
import { stlImages } from "../../data/brands";
import { useI18n } from "../../i18n";

const ROTATE_MS = 6000;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Slide = {
  bg: string;
  text: string;
  image: string;
  /** photo: full-bleed sağ yarı; cutout: beyaz zeminli stüdyo fotoğrafı multiply ile */
  variant: "photo" | "cutout";
  logo: string;
};

// Görsel kompozisyon burada sabit; başlık/buton metinleri content'ten gelir (tr/en)
const slides: Slide[] = [
  {
    bg: "#3d4b5c",
    text: "#ffffff",
    image: stlImages.travel,
    variant: "photo",
    logo: "/logos/wexta-light.svg",
  },
  {
    bg: "linear-gradient(160deg, #eafafd 0%, #b7e8f0 45%, #29aec6 135%)",
    text: "#0a3c47",
    image: "/images/stl/valiz-milano-1.jpg",
    variant: "cutout",
    logo: "/logos/wexta.svg",
  },
  {
    bg: "#e9ecee",
    text: "#17181a",
    image: "/images/stl/valiz-wx300-1.jpg",
    variant: "cutout",
    logo: "/logos/wexta.svg",
  },
];

/**
 * Wexta hero slider — stlteknoloji.com ana sayfa slider'ının dili:
 * düz renk zemin, solda büyük başlık + beyaz pill CTA, ince yuvarlak
 * oklar, altta dash pagination, 6 sn otomatik rotasyon (hover'da durur).
 */
export function WextaSlider({ channelHref }: { channelHref: string }) {
  const { t } = useI18n();
  const copy = t.brands.wexta.slider;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion() || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);
  const s = slides[index];

  return (
    <section
      className="relative h-[calc(100svh-var(--nav-h))] min-h-[540px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Sahneler */}
      {slides.map((sl, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ background: sl.bg, opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          {sl.variant === "photo" ? (
            <>
              <img
                src={sl.image}
                alt=""
                aria-hidden
                className="absolute inset-y-0 right-0 h-full w-[62%] object-cover"
                style={{
                  maskImage: "linear-gradient(to right, transparent, #000 22%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, #000 22%)",
                }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(61,75,92,0.55) 32%, transparent 60%)" }} />
            </>
          ) : (
            <img
              src={sl.image}
              alt=""
              aria-hidden
              className="absolute bottom-0 right-[6%] h-[78%] w-[52%] object-contain object-bottom md:right-[8%]"
              style={{ mixBlendMode: "multiply" }}
            />
          )}
        </div>
      ))}

      {/* Metin bloğu */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-center px-5 md:px-16">
        <div className="max-w-xl" style={{ color: s.text }}>
          <img src={s.logo} alt="wexta" className="mb-6 h-7 w-auto object-contain md:h-8" />
          <h1 key={index} className="font-display text-4xl font-bold leading-[1.08] tracking-tightest md:text-6xl">
            {copy[index]?.title}
          </h1>
          <a
            href={channelHref}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#17181a] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.4)] transition-transform hover:scale-[1.03]"
          >
            {copy[index]?.cta}
          </a>
        </div>
      </div>

      {/* Oklar */}
      <button
        onClick={() => go(index - 1)}
        aria-label="Önceki"
        className="absolute left-4 top-1/2 z-20 grid size-14 -translate-y-1/2 place-items-center rounded-full border transition-opacity hover:opacity-100 md:left-8"
        style={{ borderColor: `${s.text}44`, color: s.text, opacity: 0.7 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Sonraki"
        className="absolute right-4 top-1/2 z-20 grid size-14 -translate-y-1/2 place-items-center rounded-full border transition-opacity hover:opacity-100 md:right-8"
        style={{ borderColor: `${s.text}44`, color: s.text, opacity: 0.7 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* Dash pagination */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:left-auto md:right-16 md:translate-x-0">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slayt ${i + 1}`}
            aria-current={i === index}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 44 : 28,
              background: s.text,
              opacity: i === index ? 0.95 : 0.35,
            }}
          />
        ))}
      </div>
    </section>
  );
}
