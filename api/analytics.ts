/**
 * GA4 özeti — admin paneli için sunucu tarafı uç noktası.
 *
 * Neden fonksiyon: GA4 Data API servis hesabı ister, servis hesabının özel
 * anahtarı tarayıcıya konamaz. Anahtar yalnızca burada, Vercel ortam
 * değişkeninde durur; panel sadece bu uca istek atar.
 *
 * Yetki: çağıran, panele giriş yapmış Supabase kullanıcısı olmalı. İstek
 * Authorization başlığındaki erişim jetonuyla Supabase'e sorulur; geçersizse
 * 401 döner. Uç açık bırakılırsa site trafiği herkese görünür olurdu.
 *
 * Bağımlılık yok: Google'ın JWT akışı node:crypto ile elle kuruluyor,
 * google-auth-library derlemeye eklenmiyor.
 *
 * İmza: Node'un kendi (req, res) çifti. Önceki sürüm Web standardı
 * Request/Response kullanıyordu ve canlıda her çağrı FUNCTION_INVOCATION_FAILED
 * ile düşüyordu — panelde "Sunucu 500 döndü" olarak görünüyordu. Node imzası
 * çalışma zamanının varsayılanı; yorumlanacak bir yanı yok.
 *
 * Gereken ortam değişkenleri (Vercel > Settings > Environment Variables):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  servis hesabı JSON anahtarının tamamı
 *   GA4_PROPERTY_ID              yalnızca sayı, ör. 493827156
 *   VITE_SUPABASE_URL            jeton doğrulaması için (zaten tanımlı)
 *   VITE_SUPABASE_ANON_KEY       aynı şekilde (zaten tanımlı)
 */
import { createSign } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

type ServiceAccount = { client_email: string; private_key: string };

type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GaResponse = { rows?: GaRow[] };

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Servis hesabı JWT'si imzalayıp erişim jetonuna çevirir */
async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = base64url(signer.sign(sa.private_key));

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
  });

  if (!res.ok) throw new Error(`token alınamadı: ${res.status} ${(await res.text()).slice(0, 160)}`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("token yanıtı boş");
  return data.access_token;
}

/**
 * Panele giriş yapmış Supabase kullanıcısı mı.
 *
 * `apikey` başlığına projenin anon anahtarı gider, `Authorization` başlığına
 * kullanıcının jetonu. Önceki sürüm ikisine de jetonu koyuyordu; Supabase'in
 * ağ geçidi bunu bazen kabul edip bazen 401 döndürüyordu, paneldeki aralıklı
 * "401 döndü" hatası buradan geliyordu.
 */
async function isSignedIn(
  authHeader: string | undefined,
  supabaseUrl: string,
  anonKey: string,
): Promise<boolean> {
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function runReport(token: string, propertyId: string, body: unknown): Promise<GaResponse> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as GaResponse;
}

const num = (r: GaRow, i = 0) => Number(r.metricValues?.[i]?.value ?? 0);
const dim = (r: GaRow, i = 0) => r.dimensionValues?.[i]?.value ?? "";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const json = (body: unknown, status = 200) => {
    res.statusCode = status;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.end(JSON.stringify(body));
  };

  // Hangi hata olursa olsun panel JSON görsün: çıplak bir istisna Vercel'de
  // FUNCTION_INVOCATION_FAILED'e dönüşüyor ve arayüzde sebebi okunmuyor.
  try {
    if (req.method !== "GET") return json({ error: "method" }, 405);

    const saRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const propertyId = process.env.GA4_PROPERTY_ID;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

    const missing = [
      !saRaw && "GOOGLE_SERVICE_ACCOUNT_JSON",
      !propertyId && "GA4_PROPERTY_ID",
      !supabaseUrl && "VITE_SUPABASE_URL",
      !anonKey && "VITE_SUPABASE_ANON_KEY",
    ].filter(Boolean);

    if (missing.length > 0) {
      return json({ error: "unconfigured", detail: `Tanımlı değil: ${missing.join(", ")}` }, 503);
    }

    const auth = req.headers.authorization;
    if (!(await isSignedIn(auth, supabaseUrl!, anonKey!))) {
      return json({ error: "unauthorized", detail: "Oturum doğrulanamadı." }, 401);
    }

    // Kaç günlük pencere: panel ?days=7|28|90 gönderebilir
    const query = new URL(req.url ?? "/", "http://localhost").searchParams;
    const days = Math.min(365, Math.max(1, Number(query.get("days")) || 28));
    const range = [{ startDate: `${days}daysAgo`, endDate: "today" }];

    const sa = JSON.parse(saRaw!) as ServiceAccount;
    // Vercel ortam değişkeninde satır sonları \n olarak kaçmış olabiliyor
    sa.private_key = sa.private_key.replace(/\\n/g, "\n");
    const token = await getAccessToken(sa);

    const [totals, byDay, topPages, channels, countries] = await Promise.all([
      runReport(token, propertyId!, {
        dateRanges: range,
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
      }),
      runReport(token, propertyId!, {
        dateRanges: range,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport(token, propertyId!, {
        dateRanges: range,
        // Başlık okunaklı, yol kesin: ikisi birlikte alınıp panelde başlık
        // gösteriliyor, yol ipucu olarak veriliyor.
        dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      }),
      runReport(token, propertyId!, {
        dateRanges: range,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
      }),
      runReport(token, propertyId!, {
        dateRanges: range,
        // countryId ISO 3166-1 alpha-2 döndürüyor; panelde dünya haritasını
        // boyamak için gerekiyor (src/data/worldPaths.ts aynı anahtarı kullanır).
        dimensions: [{ name: "countryId" }, { name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 20,
      }),
    ]);

    const t = totals.rows?.[0];

    return json({
      days,
      updatedAt: new Date().toISOString(),
      totals: {
        users: t ? num(t, 0) : 0,
        sessions: t ? num(t, 1) : 0,
        pageViews: t ? num(t, 2) : 0,
        avgSessionSeconds: t ? Math.round(num(t, 3)) : 0,
      },
      trend: (byDay.rows ?? []).map((r) => ({ date: dim(r), users: num(r) })),
      topPages: (topPages.rows ?? []).map((r) => ({ title: dim(r, 0), path: dim(r, 1), views: num(r) })),
      channels: (channels.rows ?? []).map((r) => ({ name: dim(r), sessions: num(r) })),
      countries: (countries.rows ?? []).map((r) => ({ code: dim(r, 0), name: dim(r, 1), users: num(r) })),
    });
  } catch (err) {
    return json({ error: "upstream", detail: String(err).slice(0, 300) }, 502);
  }
}
