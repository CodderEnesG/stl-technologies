/**
 * Admin panelinde kaydedilen metinleri Supabase'ten çeker.
 *
 * Ziyaretçi tarafında supabase-js kullanılmaz — tek bir REST çağrısı yeterli,
 * kütüphane admin chunk'ında kalsın. Sözleşme fressiReviews.ts ile aynı:
 * bu fonksiyon asla hata atmaz, başarısızlıkta null döner ve site koddaki
 * metinle çalışmaya devam eder.
 */
import type { Overrides } from "./paths";

export type ContentPayload = { tr: Overrides; en: Overrides };

type Row = { page: string; tr: unknown; en: unknown };

const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const contentApiConfigured = Boolean(URL_BASE && ANON_KEY);

const CACHE_KEY = "stl-content-v1";

const flatten = (value: unknown): Overrides => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const out: Overrides = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
};

/**
 * Kaydedilmiş metinler; env yoksa ya da istek başarısızsa null.
 *
 * İstek bilinçli olarak burada, uygulama yüklendikten sonra yapılıyor.
 * Denendi ve geri alındı: isteği index.html'de sayfanın en başında başlatmak.
 * Amaç metin geçişini ilk boyamaya yetiştirmekti, ama tablo boş olduğu için
 * (yanıt 35 bayt, boş dizi) geçen bir metin yoktu; geriye yalnızca kritik
 * yola eklenen üçüncü taraf el sıkışması kaldı ve PageSpeed'de ilk boyama
 * beş sayfada birden yarım saniye geriledi.
 *
 * Panelden metin kaydedilmeye başlanırsa bu konu yeniden açılmalı. O zaman
 * doğru çözüm isteği öne almak değil, metni derleme sırasında ön-render'a
 * gömmek: çalışma zamanında hiç istek olmaz.
 */
export async function fetchContentOverrides(signal?: AbortSignal): Promise<ContentPayload | null> {
  if (!URL_BASE || !ANON_KEY) return null;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/site_content?select=page,tr,en`, {
      signal,
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as unknown;
    if (!Array.isArray(rows)) return null;

    const payload: ContentPayload = { tr: {}, en: {} };
    for (const row of rows as Row[]) {
      Object.assign(payload.tr, flatten(row?.tr));
      Object.assign(payload.en, flatten(row?.en));
    }
    return payload;
  } catch {
    return null;
  }
}

/** Son bilinen metinler — dönen ziyaretçide metin sıçraması olmasın diye. */
export function readContentCache(): ContentPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ContentPayload;
    if (!parsed || typeof parsed !== "object") return null;
    return { tr: flatten(parsed.tr), en: flatten(parsed.en) };
  } catch {
    return null;
  }
}

export function writeContentCache(payload: ContentPayload): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // kota dolu ya da özel sekme: önbellek olmadan da çalışır
  }
}

export function clearContentCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* yoksay */
  }
}
