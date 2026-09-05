import { toneStyles, type BrandCtx } from "./brand/sections";
import { Icon, type IconName } from "./Icon";
import type { Partner } from "../data/partners";

/**
 * Referans logo şeridi.
 *
 * Logolar birbirinden çok farklı oranlarda geliyor (LC Waikiki 7:1 uzun bir
 * kelime işareti, D'S Damat neredeyse kare). Hepsini aynı yüksekliğe ya da aynı
 * genişliğe oturtmak yanlış görünür: uzun olan devleşir, kare olan kaybolur.
 * Bu yüzden her logo eşit *alana* getiriliyor — yükseklik = √(alan / oran) —
 * ve tamamı dolu kutulu logolar `scale` ile bir tık küçültülüyor. Sonuçta
 * kutular birebir aynı dikdörtgen, içindeki logolar da eşit ağırlıkta.
 */
const AREA = 2600;
const MAX_H = 40;
const MAX_W = 132;

function fit(p: Partner) {
  const k = p.scale ?? 1;
  let h = Math.min(MAX_H, Math.sqrt(AREA / p.ratio));
  let w = h * p.ratio;
  if (w > MAX_W) {
    w = MAX_W;
    h = w / p.ratio;
  }
  return { width: w * k, height: h * k };
}

export function PartnerLogos({
  ctx,
  kicker,
  title,
  note,
  items,
  icon,
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  note?: string;
  items: Partner[];
  icon?: IconName;
}) {
  const s = toneStyles[ctx.tone];
  return (
    <section className="border-t" style={{ background: "var(--surface)", borderColor: s.cardBorder }}>
      <div className="mx-auto max-w-[1400px] px-5 pt-24 text-center md:px-8">
        <p
          className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: ctx.brand.color }}
        >
          {icon && <Icon name={icon} size={16} strokeWidth={ctx.iconWeight ?? 1.75} />}
          {kicker}
        </p>
        <h2 className={`mx-auto mt-3 max-w-2xl ${ctx.font} text-2xl font-semibold leading-tight tracking-tightest md:text-3xl`}>
          {title}
        </h2>
      </div>

      <ul className="mx-auto mt-12 flex max-w-[1000px] flex-wrap justify-center gap-3 px-5 md:px-8">
        {items.map((p) => {
          const box = fit(p);
          return (
            <li
              key={p.name}
              className="group grid w-[calc(50%-0.375rem)] place-items-center rounded-xl border transition-colors duration-300 sm:w-[150px] lg:w-[172px]"
              style={{ height: 84, background: s.card, borderColor: s.cardBorder }}
            >
              <img
                src={p.src}
                alt={`${p.name} logosu`}
                loading="lazy"
                decoding="async"
                width={Math.round(box.width)}
                height={Math.round(box.height)}
                className="max-w-[78%] object-contain opacity-80 transition duration-300 [filter:var(--logo-filter)] group-hover:opacity-100 group-hover:[filter:none]"
                style={{ ...box, "--logo-filter": `grayscale(1) ${p.filter ?? ""}`.trim() } as React.CSSProperties}
              />
            </li>
          );
        })}
      </ul>

      {note && (
        <p className="mx-auto max-w-[1400px] px-5 pb-16 pt-10 text-center text-xs md:px-8" style={{ color: s.muted }}>
          {note}
        </p>
      )}
    </section>
  );
}
