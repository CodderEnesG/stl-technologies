import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/** index.html'deki gtag.js etiketiyle aynı ölçüm kimliği */
export const GA_MEASUREMENT_ID = "G-H2L0367MVL";

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["set", Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Ölçüm yalnızca canlı yayında açık: yerel geliştirme ve derleme sırasındaki
 * ön render gerçek raporları kirletmesin diye atlanır.
 */
function isEnabled(): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  if (import.meta.env.DEV) return false;
  const host = window.location.hostname;
  return host !== "localhost" && host !== "127.0.0.1";
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
 * Her rota değişiminde bir page_view atar. Aynı yol için iki kez
 * tetiklenmemesi diye son gönderilen yol hatırlanır; başlık alt sayfanın
 * usePageMeta efektinden sonra okunsun diye bir kare beklenir.
 */
export function usePageViewTracking(): void {
  const { pathname, search } = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = pathname + search;
    if (lastPath.current === path) return;
    lastPath.current = path;

    const raf = requestAnimationFrame(() => trackPageView(path));
    return () => cancelAnimationFrame(raf);
  }, [pathname, search]);
}
