import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { PAGES, type PageId } from "./schema";
import { useContent } from "./useContent";
import { FieldRow, Toast } from "./fields";
import { History } from "./History";
import { StlLogo } from "../components/Logo";

const formatSavedAt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

export function Editor({ user }: { user: User }) {
  const [pageId, setPageId] = useState<PageId>("home");
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  /** Kapatılmış bölümler — uzun sayfalarda (wexta 100+ alan) gezinmeyi kolaylaştırır */
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const {
    sections,
    values,
    defaults,
    status,
    error,
    savedAt,
    isDirty,
    dirtyPaths,
    setValue,
    resetField,
    revert,
    loadRevision,
    save,
  } = useContent(pageId);

  const page = PAGES.find((p) => p.id === pageId)!;

  const onSave = useCallback(async () => {
    if (!isDirty || status === "saving") return;
    const ok = await save();
    if (ok) setToast("Kaydedildi. Değişiklikler sitede yayında.");
  }, [isDirty, status, save]);

  // Ctrl/Cmd + S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave]);

  // Kaydedilmemiş değişiklikle sekmeyi kapatma uyarısı
  useEffect(() => {
    if (!isDirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [isDirty]);

  const switchPage = (next: PageId) => {
    if (next === pageId) return;
    if (
      isDirty &&
      !window.confirm("Kaydedilmemiş değişiklikler var. Yine de başka sayfaya geçilsin mi?")
    ) {
      return;
    }
    setPageId(next);
    setCollapsed(new Set());
  };

  const changedCount = dirtyPaths.size;

  return (
    <div className="min-h-screen bg-stl-surface pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <StlLogo size={30} />
          <span className="hidden text-sm font-semibold text-stl-ink sm:block">
            İçerik Yönetimi
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted md:block">{user.email}</span>
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-stl-ink transition hover:border-stl-red hover:text-stl-red"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-7">
        {/* Sayfa listesi */}
        <nav className="hidden w-52 shrink-0 lg:block">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            Sayfalar
          </p>
          <ul className="sticky top-24 space-y-0.5">
            {PAGES.map((p) => {
              const active = p.id === pageId;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => switchPage(p.id)}
                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition ${
                      active
                        ? "bg-white font-semibold text-stl-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                        : "text-muted hover:bg-white/60 hover:text-stl-ink"
                    }`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.title}
                    {active && isDirty && (
                      <span className="ml-auto text-[10px] font-semibold text-stl-red">
                        {changedCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          {/* Mobil sayfa seçici */}
          <div className="mb-5 lg:hidden">
            <label htmlFor="page-select" className="sr-only">
              Sayfa
            </label>
            <select
              id="page-select"
              value={pageId}
              onChange={(e) => switchPage(e.target.value as PageId)}
              className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm font-semibold text-stl-ink"
            >
              {PAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-stl-ink">
                {page.title}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {savedAt
                  ? `Son kayıt: ${formatSavedAt(savedAt)}`
                  : "Bu sayfa henüz düzenlenmedi; metinler özgün hâlinde."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="rounded-md border border-border bg-white px-3 py-2 text-xs font-semibold text-stl-ink transition hover:border-stl-red hover:text-stl-red"
              >
                Geçmiş
              </button>
              <a
                href={page.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border bg-white px-3 py-2 text-xs font-semibold text-stl-ink transition hover:border-stl-red hover:text-stl-red"
              >
                Sayfayı aç ↗
              </a>
            </div>
          </div>

          {error && (
            <p className="mb-5 rounded-md border border-stl-red/25 bg-stl-red/6 px-4 py-3 text-sm text-stl-red">
              {error}
            </p>
          )}

          {status === "loading" ? (
            <p className="py-16 text-center text-sm text-muted">Metinler yükleniyor…</p>
          ) : (
            <div className="space-y-5">
              {sections.map((section) => {
                const open = !collapsed.has(section.id);
                const changedHere = section.paths.filter((p) => dirtyPaths.has(p)).length;

                return (
                  <section
                    key={section.id}
                    className="overflow-hidden rounded-xl border border-border bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-stl-surface/50 md:px-6"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-base font-bold tracking-tight text-stl-ink">
                            {section.title}
                          </span>
                          {changedHere > 0 && (
                            <span className="rounded-full bg-stl-red/10 px-2 py-0.5 text-[10px] font-bold text-stl-red">
                              {changedHere}
                            </span>
                          )}
                        </span>
                        {section.note && (
                          <span className="mt-1 block text-xs text-muted">{section.note}</span>
                        )}
                      </span>
                      <span className="flex items-center gap-2 pt-0.5 text-xs text-muted">
                        {section.paths.length} metin
                        <span
                          aria-hidden
                          className={`inline-block transition-transform ${open ? "rotate-180" : ""}`}
                        >
                          ⌄
                        </span>
                      </span>
                    </button>

                    {open && (
                      <div className="space-y-4 border-t border-border px-5 py-5 md:px-6">
                        {section.groups.map((group) => {
                          const rows = group.fields.map((field) => (
                            <FieldRow
                              key={field.path}
                              field={field}
                              values={values}
                              defaults={defaults}
                              dirty={dirtyPaths.has(field.path)}
                              onChange={setValue}
                              onReset={resetField}
                            />
                          ));

                          if (!group.title) {
                            return (
                              <div key={group.key} className="divide-y divide-border/70">
                                {rows}
                              </div>
                            );
                          }
                          return (
                            <div
                              key={group.key}
                              className="rounded-lg border border-border/70 bg-stl-surface/40 px-4 py-3"
                            >
                              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                                {group.title}
                              </p>
                              <div className="divide-y divide-border/70">{rows}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Kaydetme çubuğu */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white shadow-[0_-1px_12px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <p className="text-sm text-muted">
            {isDirty
              ? `${changedCount} metin değiştirildi`
              : "Tüm değişiklikler kayıtlı"}
          </p>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={revert}
              disabled={!isDirty}
              className="rounded-md border border-border px-3.5 py-2 text-sm font-semibold text-stl-ink transition hover:border-stl-ink disabled:opacity-40"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => void onSave()}
              disabled={!isDirty || status === "saving"}
              className="rounded-md bg-stl-red px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-40"
            >
              {status === "saving" ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <History pageId={pageId} onClose={() => setShowHistory(false)} onLoad={loadRevision} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
