import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { brands } from "../data/brands";
import { sectionIds, switchLangPath, useI18n } from "../i18n";
import { Arrow } from "./Arrow";
import { LogoSlot } from "./LogoSlot";
import { StlLogo } from "./Logo";

export function Navbar() {
  const [openDrop, setOpenDrop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inView, setInView] = useState<string | null>(null);
  const { pathname, hash } = useLocation();
  const { lang, t, p, s: sec } = useI18n();

  const active = brands.find((b) => pathname === p[b.slug as keyof typeof p]);
  const accent = active?.color ?? "#e10000";

  // Marka sayfasında navbar o markanın zeminini/kontrastını alır; çatıda beyaz kalır.
  const onDark = active?.navOnDark ?? false;
  // Sayfa başında navbar sayfanın zeminiyle aynı renkte ve kontursuz durur;
  // aşağı kayınca yarı saydam zemine ve konturuna geçer.
  const navBg = scrolled
    ? (active?.navBg ?? "rgba(255,255,255,0.86)")
    : (active?.navTopBg ?? "#ffffff");
  const fg = onDark ? "#ffffff" : "var(--foreground)";
  const line = onDark ? "rgba(255,255,255,0.16)" : "var(--border)";
  const dim = onDark ? "rgba(255,255,255,0.62)" : "var(--muted)";
  const hoverBg = onDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
  const panelBg = onDark ? "#12131a" : "#ffffff";

  // Tek sayfa çatıda "aktif sekme" = ekranda olan bölüm.
  const onHome = pathname === p.home;
  useEffect(() => {
    if (!onHome) {
      setInView(null);
      return;
    }
    const ids = Object.values(sectionIds);
    const nodes = ids.map((id) => document.getElementById(id)).filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setInView(hit.target.id);
        else setInView(null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [onHome, pathname]);

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
      className="sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500"
      style={{
        background: navBg,
        color: fg,
        borderColor: scrolled ? line : "transparent",
        boxShadow: scrolled
          ? onDark
            ? "0 12px 40px -20px rgba(0,0,0,0.8)"
            : "0 12px 40px -20px rgba(0,0,0,0.25)"
          : "none",
      }}
    >
      <div className="mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center justify-between px-5 md:px-8">
        {/* Marka sayfasında marka logosu, çatıda STL logosu — her ikisi de çatı ana sayfasına gider */}
        <Link
          to={p.home}
          className="flex items-center"
          aria-label={active ? `${active.name} — STL Teknoloji ana sayfa` : "STL Teknoloji"}
        >
          {active ? (
            <LogoSlot
              src={onDark ? (active.logoLightWide ?? active.logoLight) : (active.logoDarkWide ?? active.logoDark)}
              label={active.name}
              height={30}
              onDark={onDark}
            />
          ) : (
            <StlLogo size={46} />
          )}
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <div
            className="relative"
            onMouseEnter={() => setOpenDrop(true)}
            onMouseLeave={() => setOpenDrop(false)}
          >
            <button
              className="flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors"
              style={{ color: openDrop ? accent : fg, background: openDrop ? hoverBg : "transparent" }}
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
              <div
                className="grid grid-cols-2 gap-2 rounded-3xl border p-2 shadow-[0_32px_80px_-28px_rgba(0,0,0,0.4)]"
                style={{ background: panelBg, borderColor: line }}
              >
                {brands.map((b) => {
                  const cardOnDark = b.panelText === "#ffffff";
                  const logo = cardOnDark
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
                        <LogoSlot src={logo} label={b.name} height={20} onDark={cardOnDark} />
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

          <NavItem to={sec("about")} accent={accent} color={fg} active={inView === sectionIds.about}>
            {t.nav.about}
          </NavItem>

          <Link
            to={switchLangPath(pathname, hash)}
            className="ml-3 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ borderColor: line, color: dim }}
            aria-label={lang === "tr" ? "Switch to English" : "Türkçe'ye geç"}
          >
            {lang === "tr" ? "EN" : "TR"}
          </Link>

          <Link
            to={sec("contact")}
            className="ml-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: accent, color: active?.onColor ?? "#ffffff" }}
          >
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            to={switchLangPath(pathname, hash)}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: line, color: dim }}
          >
            {lang === "tr" ? "EN" : "TR"}
          </Link>
          <button
            className="grid size-10 place-items-center rounded-full"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={t.nav.menuAria}
            aria-expanded={openMobile}
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 transition-transform ${openMobile ? "translate-y-2 rotate-45" : ""}`}
                style={{ background: fg }}
              />
              <span
                className={`block h-0.5 w-5 transition-opacity ${openMobile ? "opacity-0" : ""}`}
                style={{ background: fg }}
              />
              <span
                className={`block h-0.5 w-5 transition-transform ${openMobile ? "-translate-y-2 -rotate-45" : ""}`}
                style={{ background: fg }}
              />
            </div>
          </button>
        </div>
      </div>

      {openMobile && (
        <div className="border-t px-5 py-4 md:hidden" style={{ background: panelBg, borderColor: line, color: fg }}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: dim }}>
            {t.nav.brandsLabel}
          </p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {brands.map((b) => {
              const cardOnDark = b.panelText === "#ffffff";
              return (
                <Link
                  key={b.slug}
                  to={p[b.slug as keyof typeof p]}
                  onClick={() => setOpenMobile(false)}
                  className="flex items-center justify-center rounded-xl px-3 py-3.5"
                  style={{ background: b.panelBg }}
                >
                  <LogoSlot src={cardOnDark ? (b.logoLightWide ?? b.logoLight) : (b.logoDarkWide ?? b.logoDark)} label={b.name} height={18} onDark={cardOnDark} />
                </Link>
              );
            })}
          </div>
          <Link to={sec("about")} onClick={() => setOpenMobile(false)} className="block py-2 font-medium" style={{ color: fg }}>
            {t.nav.about}
          </Link>
          <Link
            to={sec("contact")}
            onClick={() => setOpenMobile(false)}
            className="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold"
            style={{ background: accent, color: active?.onColor ?? "#ffffff" }}
          >
            {t.nav.contact}
          </Link>
        </div>
      )}
    </header>
  );
}

function NavItem({
  to,
  accent,
  color,
  active,
  children,
}: {
  to: string;
  accent: string;
  color: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link to={to} className="relative px-4 py-2 transition-colors" aria-current={active ? "true" : undefined}>
      <span style={{ color: active ? accent : color }}>{children}</span>
      <span
        className="absolute inset-x-4 -bottom-px h-0.5 origin-left transition-transform duration-300"
        style={{ background: accent, transform: active ? "scaleX(1)" : "scaleX(0)" }}
      />
    </Link>
  );
}
