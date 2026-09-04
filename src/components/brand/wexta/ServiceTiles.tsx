import { Link } from "react-router";
import { useI18n } from "../../../i18n";
import { Arrow } from "../../Arrow";
import { type BrandCtx, toneStyles } from "../sections";

export type ServiceTile = {
  title: string;
  text: string;
  cta: string;
  image: string;
  /** Dış bağlantı (katalog PDF gibi). Verilmezse iletişim bölümüne gider. */
  href?: string;
};

/**
 * Hizmet kartları — Rimowa "at your service" düzeninin B2B karşılığı:
 * katalog, teklif, OEM. Görsel 4:5, altında başlık + tek satır + ok.
 */
export function ServiceTiles({ ctx, eyebrow, title, tiles }: { ctx: BrandCtx; eyebrow: string; title: string; tiles: ServiceTile[] }) {
  const { s: sec } = useI18n();
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: s.muted }}>
        <span>{eyebrow}</span>
        <span className="h-px flex-1" style={{ background: s.cardBorder }} />
      </div>
      <h2 className={`mt-6 ${ctx.font} text-3xl font-bold leading-[1.05] tracking-tightest md:text-4xl`}>{title}</h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {tiles.map((tile) => {
          const inner = (
            <>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl" style={{ background: "rgba(127,127,127,0.08)" }}>
                <img
                  src={tile.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className={`${ctx.font} text-xl font-bold tracking-tightest`}>{tile.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: s.sub }}>{tile.text}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: brand.color }}>
                    {tile.cta} <Arrow />
                  </span>
                </div>
              </div>
            </>
          );
          return tile.href ? (
            <a key={tile.title} href={tile.href} target="_blank" rel="noreferrer" className="group block">
              {inner}
            </a>
          ) : (
            <Link key={tile.title} to={sec("contact")} className="group block">
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
