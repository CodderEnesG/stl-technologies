import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { getConsent, subscribeConsent } from "./consent";

/** index.html'deki gtag kuyruğuyla aynı ölçüm kimliği */
export const GA_MEASUREMENT_ID = "G-H2L0367MVL";

const SCRIPT_ID = "ga-gtag";

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["consent", "default" | "update", Record<string, unknown>]
  | ["set", Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Ölçüm üç koşulun tümünü ister: ziyaretçi onayı, canlı yayın ve sayfada
 * hazır bekleyen gtag kuyruğu. Yerel geliştirme ve derleme sırasındaki
 * ön-render gerçek raporları kirletmesin diye atlanır.
 */
function isEnabled(): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  if (getConsent() !== "granted") return false;
  if (import.meta.env.DEV) return false;
  const host = window.location.hostname;
  return host !== "localhost" && host !== "127.0.0.1";
}

/**
 * gtag.js yalnızca onaydan sonra sayfaya ekleniyor: reddeden ziyaretçinin
 * tarayıcısı Google'a hiç istek atmıyor.
 */
function loadGtagScript(): void {
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/** Tek bir GA4 olayı gönderir; ölçüm kapalıysa sessizce düşürür. */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!isEnabled()) return;
  window.gtag?.("event", name, params);
}

/** Yol değişiminde page_view gönderir (SPA olduğu için otomatik gönderim kapalı). */
export function trackPageView(path: string): void {
  if (!isEnabled()) return;
  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
    send_to: GA_MEASUREMENT_ID,
  });
}

/**
 * Her rota değişiminde bir page_view atar; onay sonradan verilirse o anki
 * sayfa da sayılır. Aynı yol iki kez gönderilmesin diye son yol hatırlanır,
 * başlık alt sayfanın usePageMeta efektinden sonra okunsun diye bir kare
 * beklenir.
 */
export function usePageViewTracking(): void {
  const { pathname, search } = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = pathname + search;
    let raf = 0;

    const send = () => {
      if (!isEnabled()) return;
      loadGtagScript();
      if (lastPath.current === path) return;
      lastPath.current = path;
      raf = requestAnimationFrame(() => trackPageView(path));
    };

    send();
    const unsubscribe = subscribeConsent(send);
    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
    };
  }, [pathname, search]);
}
