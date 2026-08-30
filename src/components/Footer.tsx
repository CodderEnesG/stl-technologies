import { Link } from "react-router";
import { brands } from "../data/brands";
import { company } from "../data/company";
import { useI18n } from "../i18n";
import { StlLogo } from "./Logo";

export function Footer() {
  const { t, p, s: sec } = useI18n();
  return (
    <footer className="border-t border-border bg-[var(--surface)] text-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <StlLogo size={50} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          <a
            href={company.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Instagram
          </a>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            {t.footer.brandsHeading}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link
                  to={p[b.slug as keyof typeof p]}
                  className="group inline-flex items-center gap-2.5 text-foreground/80 transition-colors hover:text-foreground"
                >
                  <span className="size-2 rounded-full" style={{ background: b.color }} />
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            {t.footer.corporateHeading}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to={sec("about")} className="text-foreground/80 transition-colors hover:text-foreground">{t.nav.about}</Link></li>
            <li><Link to={sec("contact")} className="text-foreground/80 transition-colors hover:text-foreground">{t.nav.contact}</Link></li>
            <li>
              <a href={company.kvkkUrl} target="_blank" rel="noreferrer" className="text-foreground/80 transition-colors hover:text-foreground">
                {t.footer.kvkk}
              </a>
            </li>
            <li>
              <a href={company.privacyUrl} target="_blank" rel="noreferrer" className="text-foreground/80 transition-colors hover:text-foreground">
                {t.footer.privacy}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            {t.footer.contactHeading}
          </h4>
          <address className="space-y-2.5 text-sm not-italic leading-relaxed text-muted">
            <p>
              {company.addressLines.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
            </p>
            <p>
              <a href={company.phoneHref} className="transition-colors hover:text-[var(--accent)]">
                {company.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${company.email}`} className="transition-colors hover:text-[var(--accent)]">
                {company.email}
              </a>
            </p>
            <p>{company.hours}</p>
          </address>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-2 px-5 py-6 text-xs text-muted md:flex-row md:items-center md:px-8">
          <p>
            © {new Date().getFullYear()} {company.name}. {t.footer.rights}
          </p>
          <p>Oxyra · Fressi · wexta · BNK</p>
        </div>
      </div>
    </footer>
  );
}
