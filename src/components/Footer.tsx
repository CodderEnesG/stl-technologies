import { Link, useLocation } from "react-router";
import { brands } from "../data/brands";
import { company } from "../data/company";
import { useI18n } from "../i18n";
import { Icon } from "./Icon";
import { StlLogo } from "./Logo";

export function Footer() {
  const { t, p, s: sec } = useI18n();
  const { pathname } = useLocation();

  // Navbar gibi footer da marka sayfasında o markanın zeminini alır.
  const active = brands.find((b) => pathname === p[b.slug as keyof typeof p]);
  const accent = active?.color ?? "var(--accent)";
  const onDark = active?.footerOnDark ?? false;
  const bg = active?.footerBg ?? "var(--surface)";
  const fg = onDark ? "#ffffff" : "var(--foreground)";
  const line = onDark ? "rgba(255,255,255,0.14)" : "var(--border)";
  const dim = onDark ? "rgba(255,255,255,0.62)" : "var(--muted)";

  return (
    <footer className="border-t transition-colors duration-500" style={{ background: bg, borderColor: line, color: fg }}>
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <StlLogo size={50} style={onDark ? { filter: "brightness(0) invert(1)" } : undefined} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed" style={{ color: dim }}>{t.footer.tagline}</p>
          <a
            href={company.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: dim }}
          >
            <Icon name="instagram" size={16} />
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
                  className="group inline-flex items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100"
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
            <li><Link to={sec("about")} className="opacity-80 transition-opacity hover:opacity-100">{t.nav.about}</Link></li>
            <li><Link to={sec("contact")} className="opacity-80 transition-opacity hover:opacity-100">{t.nav.contact}</Link></li>
            <li>
              <a href={company.kvkkUrl} target="_blank" rel="noreferrer" className="opacity-80 transition-opacity hover:opacity-100">
                {t.footer.kvkk}
              </a>
            </li>
            <li>
              <a href={company.privacyUrl} target="_blank" rel="noreferrer" className="opacity-80 transition-opacity hover:opacity-100">
                {t.footer.privacy}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            {t.footer.contactHeading}
          </h4>
          <address className="space-y-3 text-sm not-italic leading-relaxed" style={{ color: dim }}>
            <p className="flex gap-2.5">
              <Icon name="map-pin" size={16} className="mt-0.5 shrink-0" />
              <span>
                {company.addressLines.map((l) => (
                  <span key={l}>
                    {l}
                    <br />
                  </span>
                ))}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="phone" size={16} className="shrink-0" />
              <a href={company.phoneHref} style={{ transition: "color .2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = accent)} onMouseLeave={(e) => (e.currentTarget.style.color = "")}>
                {company.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="mail" size={16} className="shrink-0" />
              <a href={`mailto:${company.email}`} className="break-all" style={{ transition: "color .2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = accent)} onMouseLeave={(e) => (e.currentTarget.style.color = "")}>
                {company.email}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Icon name="clock" size={16} className="shrink-0" />
              {company.hours}
            </p>
          </address>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: line }}>
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-2 px-5 py-6 text-xs md:flex-row md:items-center md:px-8"
          style={{ color: dim }}>
          <p>
            © {new Date().getFullYear()} {company.name}. {t.footer.rights}
          </p>
          <p>Oxyra · Fressi · wexta · BNK</p>
        </div>
      </div>
    </footer>
  );
}
