/**
 * Bir sayfanın metinlerini yükler, düzenler ve kaydeder.
 *
 * Veritabanına yalnızca koddaki varsayılandan **farklı** olan metinler yazılır.
 * Böylece dokunulmamış metin kodda kalır; ileride tr.ts güncellenirse site
 * yeni metni gösterir, panel eski değeri sabitlemiş olmaz.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import { buildSections, type PageId, type Section } from "./schema";

export type Lang = "tr" | "en";
export type Values = Record<string, { tr: string; en: string }>;
export type Status = "loading" | "ready" | "saving" | "error";

type Row = { tr: Record<string, string>; en: Record<string, string> };

const defaultsFor = (sections: Section[]): Values => {
  const out: Values = {};
  for (const s of sections) {
    for (const g of s.groups) {
      for (const f of g.fields) out[f.path] = { tr: f.trDefault, en: f.enDefault };
    }
  }
  return out;
};

const merge = (base: Values, row: Row | null): Values => {
  const out: Values = {};
  for (const [path, v] of Object.entries(base)) {
    out[path] = {
      tr: typeof row?.tr?.[path] === "string" ? row.tr[path]! : v.tr,
      en: typeof row?.en?.[path] === "string" ? row.en[path]! : v.en,
    };
  }
  return out;
};

/** Varsayılandan farklı olanlar — veritabanına yazılacak set */
const diffOf = (values: Values, base: Values, lang: Lang): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [path, v] of Object.entries(values)) {
    const def = base[path];
    if (def && v[lang] !== def[lang]) out[path] = v[lang];
  }
  return out;
};

export function useContent(pageId: PageId) {
  const sections = useMemo(() => buildSections(pageId), [pageId]);
  const defaults = useMemo(() => defaultsFor(sections), [sections]);

  const [saved, setSaved] = useState<Values>(defaults);
  const [values, setValues] = useState<Values>(defaults);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    setError(null);

    (async () => {
      if (!supabase) {
        if (alive) {
          setSaved(defaults);
          setValues(defaults);
          setStatus("ready");
        }
        return;
      }
      const { data, error: err } = await supabase
        .from("site_content")
        .select("tr,en,updated_at")
        .eq("page", pageId)
        .maybeSingle();

      if (!alive) return;
      if (err) {
        setError("Metinler okunamadı. İnternet bağlantınızı kontrol edin.");
        setStatus("error");
        return;
      }
      const merged = merge(defaults, (data as Row | null) ?? null);
      setSaved(merged);
      setValues(merged);
      setSavedAt((data as { updated_at?: string } | null)?.updated_at ?? null);
      setStatus("ready");
    })();

    return () => {
      alive = false;
    };
  }, [pageId, defaults]);

  const setValue = useCallback((path: string, lang: Lang, value: string) => {
    setValues((prev) => {
      const cur = prev[path];
      if (!cur || cur[lang] === value) return prev;
      return { ...prev, [path]: { ...cur, [lang]: value } };
    });
  }, []);

  const resetField = useCallback(
    (path: string) => {
      setValues((prev) => {
        const def = defaults[path];
        if (!def) return prev;
        return { ...prev, [path]: { ...def } };
      });
    },
    [defaults],
  );

  const revert = useCallback(() => setValues(saved), [saved]);

  /** Geçmişten bir sürümü forma yükler — kaydetmez */
  const loadRevision = useCallback(
    (row: Row) => setValues(merge(defaults, row)),
    [defaults],
  );

  const dirtyPaths = useMemo(() => {
    const out = new Set<string>();
    for (const [path, v] of Object.entries(values)) {
      const s = saved[path];
      if (!s || s.tr !== v.tr || s.en !== v.en) out.add(path);
    }
    return out;
  }, [values, saved]);

  const isDirty = dirtyPaths.size > 0;

  const save = useCallback(async (): Promise<boolean> => {
    if (!supabase) {
      setError("Supabase bağlantısı yapılandırılmamış.");
      return false;
    }
    setStatus("saving");
    setError(null);

    const { data: session } = await supabase.auth.getUser();
    const now = new Date().toISOString();

    const { error: err } = await supabase.from("site_content").upsert(
      {
        page: pageId,
        tr: diffOf(values, defaults, "tr"),
        en: diffOf(values, defaults, "en"),
        updated_at: now,
        updated_by: session.user?.id ?? null,
      },
      { onConflict: "page" },
    );

    if (err) {
      setError(`Kaydedilemedi: ${err.message}`);
      setStatus("ready");
      return false;
    }
    setSaved(values);
    setSavedAt(now);
    setStatus("ready");
    return true;
  }, [pageId, values, defaults]);

  return {
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
  };
}
