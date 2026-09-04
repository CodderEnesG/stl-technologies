import { type BrandCtx, toneStyles } from "../sections";

export type Stage = { n: string; title: string; text: string };

/**
 * Üretim aşamaları — kataloğun "Extruding / Forming / Manufacture" sayfası.
 * Üç sütun, katalog dilinde: numara, ince kural, başlık, kısa metin.
 * Sütunlar tek bir çizgiyle bağlanır; aşamaların sırasını okutur.
 */
export function StageStrip({
  ctx,
  eyebrow,
  title,
  lead,
  stages,
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  lead: string;
  stages: Stage[];
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
      <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: brand.color }}>
            <span className="size-2 rounded-full" style={{ background: brand.color }} />
            {eyebrow}
          </p>
          <h2 className={`${ctx.font} text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl`}>{title}</h2>
        </div>
        <p className="max-w-md text-lg leading-relaxed md:justify-self-end" style={{ color: s.sub }}>{lead}</p>
      </div>

      <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {/* Bağlayıcı çizgi — sadece masaüstü */}
        <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px md:block" style={{ background: s.cardBorder }} />
        {stages.map((st, i) => (
          <li key={st.n} className="relative">
            <span className="flex items-center gap-3">
              <span
                className="relative z-10 grid size-[15px] place-items-center rounded-full border-2"
                style={{ borderColor: brand.color, background: i === 0 ? brand.color : s.bg }}
              />
              <span className={`${ctx.font} text-[11px] font-semibold uppercase tracking-[0.32em]`} style={{ color: s.muted }}>
                {st.n}
              </span>
            </span>
            <h3 className={`mt-5 ${ctx.font} text-2xl font-bold tracking-tightest`}>{st.title}</h3>
            <p className="mt-3 max-w-sm leading-relaxed" style={{ color: s.sub }}>{st.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
