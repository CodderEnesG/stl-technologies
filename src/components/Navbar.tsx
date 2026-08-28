import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { brands } from "../data/brands";
import { switchLangPath, useI18n } from "../i18n";
import { Arrow } from "./Arrow";
import { LogoSlot } from "./LogoSlot";
import { StlLogo } from "./Logo";

export function Navbar() {
  const [openDrop, setOpenDrop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { lang, t, p } = useI18n();

  const active = brands.find((b) => pathname === p[b.slug as keyof typeof p]);
  const accent = active?.color ?? "#e10000";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDrop(false);
        setOpenMobile(false);
      }
    };
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-border shadow-[0_12px_40px_-20px_rgba(0,0,0,0.25)]" : "border-border/60"
      }`}
      style={{ background: "rgba(255,255,255,0.86)" }}
    >
      {/* Aktif marka rengi: üst ince şerit */}
      <span
        className="absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-500"
        style={{ background: accent, transform: active ? "scaleX(1)" : "scaleX(0)" }}
      />

      <div className="mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center justify-between px-5 md:px-8">
        <Link to={p.home} className="flex items-center" aria-label="STL Teknoloji">
          <StlLogo size={30} />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <div
            className="relative"
            onMouseEnter={() => setOpenDrop(true)}
            onMouseLeave={() => setOpenDrop(false)}
          >
            <button
              className="flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors hover:bg-black/5"
              style={openDrop ? { color: accent } : undefined}
              aria-haspopup="true"
              aria-expanded={openDrop}
              onClick={() => setOpenDrop((v) => !v)}
            >
              {t.nav.brandsLabel}
              <svg width="12" height="12" viewBox="0 0 12 12" className={`transition-transform ${openDrop ? "rotate-180" : ""}`}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>

            {/* Mega dropdown: 2x2 marka kartları */}
            <div
              className={`absolute left-1/2 top-full w-[580px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                openDrop ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 rounded-3xl border border-border bg-white p-2 shadow-[0_32px_80px_-28px_rgba(0,0,0,0.4)]">
                {brands.map((b) => {
                  const onDark = b.panelText === "#ffffff";
                  const logo = onDark
                    ? (b.logoLightWide ?? b.logoLight)
                    : (b.logoDarkWide ?? b.logoDark);
                  return (
                    <Link
                      key={b.slug}
                      to={p[b.slug as keyof typeof p]}
                      onClick={() => setOpenDrop(false)}
                      className="group relative flex min-h-[108px] flex-col justify-between overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-0.5"
                      style={{ background: b.panelBg, color: b.panelText }}
                    >
                      <div className="flex items-center justify-between">
                        <LogoSlot src={logo} label={b.name} height={20} onDark={onDark} />
                        <span
                          className="grid size-7 place-items-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                          style={{ background: b.color, color: b.onColor }}
                        >
                          <Arrow />
                        </span>
                      </div>
                      <p className="max-w-[24ch] text-xs font-medium leading-snug opacity-85">
                        {t.brands[b.slug as keyof typeof t.brands].tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <NavItem to={p.about} accent={accent}>{t.nav.about}</NavItem>

          <Link
            to={switchLangPath(pathname)}
            className="ml-3 rounded-full border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-foreground hover:text-foreground"
            aria-label={lang === "tr" ? "Switch to English" : "Türkçe'ye geç"}
          >
            {lang === "tr" ? "EN" : "TR"}
          </Link>

          <Link
            to={p.contact}
            className="ml-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: accent }}
          >
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            to={switchLangPath(pathname)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted"
          >
            {lang === "tr" ? "EN" : "TR"}
          </Link>
          <button
            className="grid size-10 place-items-center rounded-full hover:bg-black/5"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={t.nav.menuAria}
            aria-expanded={openMobile}
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-foreground transition-transform ${openMobile ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${openMobile ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-foreground transition-transform ${openMobile ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {openMobile && (
        <div className="border-t border-border bg-white px-5 py-4 md:hidden">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{t.nav.brandsLabel}</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {brands.map((b) => {
              const onDark = b.panelText === "#ffffff";
              return (
                <Link
                  key={b.slug}
                  to={p[b.slug as keyof typeof p]}
                  onClick={() => setOpenMobile(false)}
                  className="flex items-center justify-center rounded-xl px-3 py-3.5"
                  style={{ background: b.panelBg }}
                >
                  <LogoSlot src={onDark ? (b.logoLightWide ?? b.logoLight) : (b.logoDarkWide ?? b.logoDark)} label={b.name} height={18} onDark={onDark} />
                </Link>
              );
            })}
          </div>
          <Link to={p.about} onClick={() => setOpenMobile(false)} className="block py-2 font-medium">{t.nav.about}</Link>
          <Link
            to={p.contact}
            onClick={() => setOpenMobile(false)}
            className="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-white"
            style={{ background: accent }}
          >
            {t.nav.contact}
          </Link>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, accent, children }: { to: string; accent: string; children: React.ReactNode }) {
  return (
    <NavLink to={to} className="relative px-4 py-2 transition-colors" end>
      {({ isActive }) => (
        <>
          <span style={isActive ? { color: accent } : undefined}>{children}</span>
          <span
            className="absolute inset-x-4 -bottom-px h-0.5 origin-left transition-transform duration-300"
            style={{
              background: accent,
              transform: isActive ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </>
      )}
    </NavLink>
  );
}
