import { Arrow } from "../../Arrow";
import { type BrandCtx, toneStyles } from "../sections";

export type ShellCard = {
  title: string;
  text: string;
  cta: string;
  /** Şeffaf zeminli ürün kesiti */
  image: string;
  /** Kartın düz stüdyo zemini (Rimowa "three materials" kartlarındaki duvar gibi) */
  bg: string;
  href?: string;
};

/**
 * Üç gövde kartı — Rimowa "your choice of three signature materials" düzeni.
 * Müşteri notu: yaşam kadrajları (stok/katalog banner) beğenilmedi; yerine
 * o sayfadaki gibi sade, ürün odaklı kareler. Elimizde o tarz çekim olmadığı
 * için katalog kesitleri düz renkli stüdyo zeminine oturtuldu. Gerçek çekim
 * gelince `image`/`bg` yerine fotoğraf konur, düzen değişmez.
 */
export function ShellTrio({ ctx, eyebrow, title, cards }: { ctx: BrandCtx; eyebrow: string; title: string; cards: ShellCard[] }) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 pb-24 md:px-8">
      <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: s.muted }}>
        <span>{eyebrow}</span>
        <span className="h-px flex-1" style={{ background: s.cardBorder }} />
      </div>
      <h2 className={`mt-6 ${ctx.font} text-3xl font-bold leading-[1.05] tracking-tightest md:text-4xl`}>{title}</h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {cards.map((card) => {
          const Wrap = card.href ? "a" : "div";
          return (
            <Wrap
              key={card.title}
              {...(card.href ? { href: card.href, target: "_blank", rel: "noreferrer" } : {})}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ background: card.bg }}>
                {/* Zemin–duvar geçişi: stüdyo hissi için altta hafif koyulaşma */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[38%]"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.07), transparent)" }}
                />
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute bottom-[9%] left-1/2 h-[74%] w-auto -translate-x-1/2 object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.16))" }}
                />
              </div>
              <h3 className={`mt-5 ${ctx.font} text-xl font-bold tracking-tightest`}>{card.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: s.sub }}>{card.text}</p>
              {card.href && (
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: brand.color }}>
                  {card.cta} <Arrow />
                </span>
              )}
            </Wrap>
          );
        })}
      </div>
    </section>
  );
}
