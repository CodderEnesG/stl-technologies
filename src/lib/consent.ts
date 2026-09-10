/**
 * Çerez onayı — tek kaynak.
 *
 * Analitik, onay verilene kadar hiç yüklenmiyor: gtag.js betiği bile sayfaya
 * eklenmiyor (bkz. lib/analytics.ts). index.html ise açılışta Google'ın Consent
 * Mode varsayılanlarını "denied" olarak bildiriyor, böylece betik sonradan
 * yüklense de reddedilmiş bir ziyarette çerez yazılmıyor.
 */

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "stl.cookie-consent.v1";

const listeners = new Set<() => void>();

/** Okuma her seferinde localStorage'a gitmesin diye ilk okumada saklanır. */
let cached: ConsentChoice | null | undefined;

function readStored(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "granted" || raw === "denied" ? raw : null;
  } catch {
    // Gizli sekme veya site verisi kapalıysa: onay yok say, banda tekrar sor.
    return null;
  }
}

/** Kayıtlı tercih; hiç seçim yapılmadıysa null. */
export function getConsent(): ConsentChoice | null {
  if (cached === undefined) cached = typeof window === "undefined" ? null : readStored();
  return cached;
}

/** Google'a onay durumunu bildirir; gtag.js yüklenmemişse kuyruğa girer. */
function notifyGoogle(choice: ConsentChoice): void {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice,
  });
}

export function setConsent(choice: ConsentChoice): void {
  cached = choice;
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Yazılamazsa tercih yalnızca bu oturum için geçerli olur.
  }
  notifyGoogle(choice);
  listeners.forEach((fn) => fn());
}

/** Tercihi siler — bant yeniden çıkar (footer'daki "Çerez tercihleri"). */
export function resetConsent(): void {
  cached = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silinemezse bant yine de açılır; sonraki seçim üzerine yazar.
  }
  notifyGoogle("denied");
  listeners.forEach((fn) => fn());
}

export function subscribeConsent(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
