import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { tr, type SiteContent } from "../content/tr";
import { en } from "../content/en";

export type Lang = "tr" | "en";

export type RouteKey = "home" | "oxyra" | "fressi" | "wexta" | "bnk";

/**
 * Hakkımızda / markalar / iletişim ayrı sayfa değil, çatı sayfanın bölümleri.
 * Çıpa id'leri iki dilde de aynı — markup tek yerde kalsın diye.
 */
export type SectionKey = "about" | "brands" | "contact";
export const sectionIds: Record<SectionKey, string> = {
  about: "hakkimizda",
  brands: "markalar",
  contact: "iletisim",
};

export const paths: Record<Lang, Record<RouteKey, string>> = {
  tr: {
    home: "/",
    oxyra: "/oxyra",
    fressi: "/fressi",
    wexta: "/wexta",
    bnk: "/bnk",
  },
  en: {
    home: "/en",
    oxyra: "/en/oxyra",
    fressi: "/en/fressi",
    wexta: "/en/wexta",
    bnk: "/en/bnk",
  },
};

export function langFromPathname(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "tr";
}

/** Mevcut sayfanın diğer dildeki karşılığı; bölüm çıpası varsa korunur */
export function switchLangPath(pathname: string, hash = ""): string {
  const from = langFromPathname(pathname);
  const to: Lang = from === "tr" ? "en" : "tr";
  const entry = (Object.entries(paths[from]) as [RouteKey, string][]).find(([, p]) => p === pathname);
  return (entry ? paths[to][entry[0]] : paths[to].home) + hash;
}

const dictionaries: Record<Lang, SiteContent> = { tr, en };

type I18n = {
  lang: Lang;
  t: SiteContent;
  p: Record<RouteKey, string>;
  /** Çatı sayfadaki bir bölüme giden bağlantı (ör. "/#iletisim", "/en#iletisim") */
  s: (key: SectionKey) => string;
};

const sectionHref = (lang: Lang) => (key: SectionKey) => `${paths[lang].home}#${sectionIds[key]}`;

const I18nContext = createContext<I18n>({ lang: "tr", t: tr, p: paths.tr, s: sectionHref("tr") });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const lang = langFromPathname(pathname);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18n>(
    () => ({ lang, t: dictionaries[lang], p: paths[lang], s: sectionHref(lang) }),
    [lang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
