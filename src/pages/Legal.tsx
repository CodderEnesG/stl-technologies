import { Link, useLocation } from "react-router";
import { legalDocs, type LegalKey } from "../content/legal";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { company } from "../data/company";

/**
 * KVKK ve gizlilik metinleri. Eskiden müşterinin kendi sitesindeki sayfalara
 * bağlanıyordu; alan adı bu siteye yönlendiğinde o sayfalar kaybolacağı için
 * metinler repoya alındı (src/content/legal.ts).
 *
 * Tek bileşen iki metni de gösterir; hangisi olduğunu yol belirler.
 */
export default function Legal() {
  const { pathname } = useLocation();
  const { t, lang, p } = useI18n();

  const key: LegalKey = pathname === p.privacy ? "privacy" : "kvkk";
  const doc = legalDocs[key][lang];

  usePageMeta(`${doc.title} — ${company.name}`, doc.title);

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-[calc(var(--nav-h)+3rem)] md:px-8">
      <Link
        to={p.home}
        className="mb-8 inline-block text-sm text-muted transition-colors hover:text-stl-red"
      >
        ← {t.notFound.home}
      </Link>

      <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tightest text-stl-ink md:text-[2.5rem]">
        {doc.title}
      </h1>

      {doc.translationNote && (
        <p className="mt-5 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
          {doc.translationNote}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {doc.blocks.map((block, i) =>
          "h" in block ? (
            <h2
              key={i}
              className="pt-6 font-display text-base font-bold tracking-tight text-stl-ink first:pt-0"
            >
              {block.h}
            </h2>
          ) : (
            <p key={i} className="text-[15px] leading-relaxed text-foreground/85">
              {block.p}
            </p>
          ),
        )}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
        {company.legalName} · {company.email} · {company.phoneDisplay}
      </p>
    </article>
  );
}
