import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { tr, type SiteContent } from "../content/tr";
import { en } from "../content/en";
import { applyOverrides } from "../content/paths";
import {
  fetchContentOverrides,
  readContentCache,
  writeContentCache,
  type ContentPayload,
} from "../content/remote";

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

/** Koddaki metinler — her zaman geçerli yedek. */
export const baseDictionaries: Record<Lang, SiteContent> = { tr, en };

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

  /**
   * Admin panelinde kaydedilen metinler. Önce localStorage önbelleğinden
   * okunur (dönen ziyaretçide metin sıçraması olmasın), sonra arka planda
   * tazelenir. İstek başarısızsa koddaki metin geçerli kalır.
   */
  const [overrides, setOverrides] = useState<ContentPayload | null>(readContentCache);

  useEffect(() => {
    const ac = new AbortController();
    fetchContentOverrides(ac.signal).then((live) => {
      if (!live) return;
      setOverrides(live);
      writeContentCache(live);
    });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const dictionaries = useMemo<Record<Lang, SiteContent>>(
    () => ({
      tr: applyOverrides(tr, overrides?.tr),
      en: applyOverrides(en, overrides?.en),
    }),
    [overrides],
  );

  const value = useMemo<I18n>(
    () => ({ lang, t: dictionaries[lang], p: paths[lang], s: sectionHref(lang) }),
    [lang, dictionaries],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
