import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { PageId } from "./schema";

type Revision = {
  id: number;
  tr: Record<string, string>;
  en: Record<string, string>;
  saved_at: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Önceki sürümler. Seçilen sürüm forma yüklenir; canlıya çıkması için
 * kullanıcının Kaydet'e basması gerekir — yanlışlıkla geri alma olmasın.
 */
export function History({
  pageId,
  onClose,
  onLoad,
}: {
  pageId: PageId;
  onClose: () => void;
  onLoad: (row: { tr: Record<string, string>; en: Record<string, string> }) => void;
}) {
  const [rows, setRows] = useState<Revision[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) return;
      const { data, error: err } = await supabase
        .from("site_content_revisions")
        .select("id,tr,en,saved_at")
        .eq("page", pageId)
        .order("saved_at", { ascending: false })
        .limit(20);
      if (!alive) return;
      if (err) setError("Geçmiş okunamadı.");
      else setRows((data ?? []) as Revision[]);
    })();
    return () => {
      alive = false;
    };
  }, [pageId]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Kapat"
        onClick={onClose}
        className="flex-1 bg-stl-ink/20"
      />
      <aside className="flex w-full max-w-sm flex-col border-l border-border bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-bold text-stl-ink">Önceki sürümler</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-muted transition hover:bg-stl-surface"
          >
            Kapat
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {error && <p className="text-sm text-stl-red">{error}</p>}
          {!rows && !error && <p className="text-sm text-muted">Yükleniyor…</p>}
          {rows?.length === 0 && (
            <p className="text-sm text-muted">
              Bu sayfa henüz kaydedilmedi; geçmiş ilk kayıttan sonra oluşur.
            </p>
          )}
          <ul className="space-y-2">
            {rows?.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3.5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stl-ink">{formatDate(r.saved_at)}</p>
                  <p className="text-xs text-muted">
                    {Object.keys(r.tr ?? {}).length} düzenlenmiş metin
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLoad({ tr: r.tr ?? {}, en: r.en ?? {} });
                    onClose();
                  }}
                  className="shrink-0 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-stl-ink transition hover:border-stl-red hover:text-stl-red"
                >
                  Forma yükle
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="border-t border-border px-5 py-3 text-xs text-muted">
          Yüklenen sürüm hemen canlıya çıkmaz. Kontrol edip Kaydet'e basın.
        </p>
      </aside>
    </div>
  );
}
