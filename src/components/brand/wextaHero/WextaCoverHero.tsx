import { wextaImages } from "../../../data/brands";
import { useI18n } from "../../../i18n";
import { Arrow } from "../../Arrow";
import { type BrandCtx } from "../sections";

/**
 * Katalog kapağı hero'su (müşteri seçimi, 2026-09-05).
 * Oxyra'daki tam ekran görselli hero'nun (BrandHeroFull) wexta karşılığı:
 * kataloğun yatay yaşam karesi tam ekran, üstünde ince katalog künyesi,
 * altta perde üzerinde wordmark + tagline. Siyah-beyaz kapak (wexta-cover.jpg)
 * "alakasız duruyor" notuyla havalimanı karesine çevrildi.
 */
export function WextaCoverHero({ ctx, channelHref }: { ctx: BrandCtx; channelHref: string }) {
  const { t } = useI18n();
  const h = t.brands.wexta.heroAlt;

  return (
    <section className="relative flex min-h-[560px] flex-col justify-end overflow-hidden md:h-[calc(100svh-var(--nav-h))]">
      <img
        src={wextaImages.cover}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: "50% 12%" }} // üst künye yazısı yüzle çakışmasın: kare aşağı kaydırıldı
      />

      {/* Katalog künyesi — üst şerit */}
      <div className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 pt-8 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/85 md:px-8">
          <span>{h.label}</span>
          <span className="hidden md:inline">İstanbul — Arnavutköy</span>
        </div>
      </div>

      {/* Okunabilirlik perdesi */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{ background: "linear-gradient(to top, rgba(10,26,32,0.9) 0%, rgba(10,26,32,0.35) 45%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[22%]"
        style={{ background: "linear-gradient(to bottom, rgba(10,26,32,0.55), transparent)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-14 md:px-8 md:pb-16">
        <img src="/logos/wexta-light.svg" alt="wexta" className="h-8 w-auto object-contain md:h-10" />
        <h1 className={`mt-6 max-w-2xl ${ctx.font} text-4xl font-bold leading-[1.06] tracking-tightest text-white md:text-6xl`}>
          {h.title}
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">{h.lead}</p>
        <a
          href={channelHref}
          target="_blank"
          rel="noreferrer"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#17181a] transition-transform hover:scale-[1.02]"
        >
          {h.cta} <Arrow />
        </a>
      </div>
    </section>
  );
}
