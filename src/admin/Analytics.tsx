import { useEffect, useState } from "react";

import { supabase } from "./supabase";

/**
 * Ziyaret özeti — GA4 paneline gitmeden temel sayılar.
 *
 * Veriyi /api/analytics uç noktası döndürür; servis hesabı anahtarı orada,
 * sunucuda durur (bkz. api/analytics.ts). Uç yapılandırılmamışsa bileşen
 * sessizce kısa bir not gösterir, panelin geri kalanı etkilenmez.
 */

type Summary = {
  days: number;
  updatedAt: string;
  totals: { users: number; sessions: number; pageViews: number; avgSessionSeconds: number };
  trend: { date: string; users: number }[];
  topPages: { path: string; views: number }[];
  channels: { name: string; sessions: number }[];
  countries: { name: string; users: number }[];
};

type State =
  | { kind: "loading" }
  | { kind: "ready"; data: Summary }
  | { kind: "unconfigured" }
  | { kind: "error"; message: string };

const RANGES = [7, 28, 90] as const;

const nf = new Intl.NumberFormat("tr-TR");

function duration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} dk ${s} sn` : `${s} sn`;
}

/** GA4 "20260912" biçimini gün/ay olarak kısaltır */
function shortDate(raw: string) {
  if (!/^\d{8}$/.test(raw)) return raw;
  return `${raw.slice(6, 8)}.${raw.slice(4, 6)}`;
}

function Sparkline({ points }: { points: { date: string; users: number }[] }) {
  if (points.length < 2) return null;

  const w = 640;
  const h = 64;
  const max = Math.max(...points.map((p) => p.users), 1);
  const step = w / (points.length - 1);
  const y = (v: number) => h - (v / max) * (h - 6) - 3;
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${y(p.users).toFixed(1)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const last = points[points.length - 1];

  return (
    <figure className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Günlük kullanıcı eğilimi" preserveAspectRatio="none">
        <path d={area} fill="#e10000" fillOpacity="0.08" />
        <path d={line} fill="none" stroke="#e10000" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={w} cy={y(last.users)} r="3.5" fill="#e10000" />
      </svg>
      <figcaption className="mt-1.5 flex justify-between text-[11px] text-muted">
        <span>{shortDate(points[0].date)}</span>
        <span>En yüksek gün: {nf.format(max)} kullanıcı</span>
        <span>{shortDate(last.date)}</span>
      </figcaption>
    </figure>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums text-stl-ink">{value}</p>
    </div>
  );
}

function List({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-2.5 space-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
            <span className="relative truncate text-stl-ink" title={r.label}>
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 -z-10 rounded-sm bg-stl-red/10"
                style={{ width: `${(r.value / max) * 100}%` }}
              />
              {r.label}
            </span>
            <span className="tabular-nums text-muted">{nf.format(r.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Analytics() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(28);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let alive = true;
    setState({ kind: "loading" });

    (async () => {
      const token = (await supabase?.auth.getSession())?.data.session?.access_token;
      if (!token) {
        if (alive) setState({ kind: "error", message: "Oturum bulunamadı." });
        return;
      }

      try {
        const res = await fetch(`/api/analytics?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!alive) return;

        if (res.status === 503) return setState({ kind: "unconfigured" });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { detail?: string };
          return setState({ kind: "error", message: body.detail ?? `Sunucu ${res.status} döndü.` });
        }
        setState({ kind: "ready", data: (await res.json()) as Summary });
      } catch {
        if (alive) setState({ kind: "error", message: "Bağlantı kurulamadı." });
      }
    })();

    return () => {
      alive = false;
    };
  }, [days]);

  return (
    <section className="mb-6 rounded-xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 font-display text-sm font-bold text-stl-ink"
          aria-expanded={open}
        >
          Ziyaret özeti
          <span aria-hidden className="text-muted">{open ? "−" : "+"}</span>
        </button>

        {open && (
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDays(r)}
                aria-pressed={days === r}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition ${
                  days === r
                    ? "border-stl-red bg-stl-red text-white"
                    : "border-border bg-white text-muted hover:border-stl-red hover:text-stl-red"
                }`}
              >
                {r} gün
              </button>
            ))}
          </div>
        )}
      </div>

      {!open ? null : state.kind === "loading" ? (
        <p className="mt-4 text-sm text-muted">Yükleniyor…</p>
      ) : state.kind === "unconfigured" ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Analitik bağlantısı henüz kurulmadı. Vercel ortam değişkenlerine{" "}
          <code className="rounded bg-stl-surface px-1 py-0.5 text-xs">GOOGLE_SERVICE_ACCOUNT_JSON</code> ve{" "}
          <code className="rounded bg-stl-surface px-1 py-0.5 text-xs">GA4_PROPERTY_ID</code> eklenince
          buraya ziyaret sayıları gelir.
        </p>
      ) : state.kind === "error" ? (
        <p className="mt-4 text-sm text-muted">Veri alınamadı. {state.message}</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Stat label="Kullanıcı" value={nf.format(state.data.totals.users)} />
            <Stat label="Oturum" value={nf.format(state.data.totals.sessions)} />
            <Stat label="Sayfa görüntüleme" value={nf.format(state.data.totals.pageViews)} />
            <Stat label="Ort. oturum" value={duration(state.data.totals.avgSessionSeconds)} />
          </div>

          <Sparkline points={state.data.trend} />

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <List
              title="En çok görüntülenen"
              rows={state.data.topPages.map((p) => ({ label: p.path, value: p.views }))}
            />
            <List
              title="Trafik kaynağı"
              rows={state.data.channels.map((c) => ({ label: c.name, value: c.sessions }))}
            />
            <List
              title="Ülke"
              rows={state.data.countries.map((c) => ({ label: c.name, value: c.users }))}
            />
          </div>

          <p className="mt-5 text-[11px] text-muted">
            Kaynak: Google Analytics 4 · Son {state.data.days} gün ·{" "}
            {new Date(state.data.updatedAt).toLocaleString("tr-TR")}
          </p>
        </>
      )}
    </section>
  );
}
