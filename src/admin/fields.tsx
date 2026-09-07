import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Field } from "./schema";
import type { Lang, Values } from "./useContent";

/** İçeriğe göre büyüyen metin kutusu — uzun paragraflarda kaydırma çubuğu olmasın */
function AutoTextarea({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      id={id}
      ref={ref}
      rows={2}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-sm leading-relaxed text-stl-ink outline-none transition focus:border-stl-red focus:ring-2 focus:ring-stl-red/12"
    />
  );
}

function LangInput({
  field,
  lang,
  value,
  defaultValue,
  onChange,
}: {
  field: Field;
  lang: Lang;
  value: string;
  defaultValue: string;
  onChange: (v: string) => void;
}) {
  const id = `${field.path}-${lang}`;
  // Varsayılanın 1,5 katını aşan metin tasarımı zorlar — engellemez, uyarır.
  const tooLong = defaultValue.length > 0 && value.length > defaultValue.length * 1.5;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted"
        >
          {lang === "tr" ? "Türkçe" : "English"}
        </label>
        <span className={`text-[10px] tabular-nums ${tooLong ? "text-amber-600" : "text-muted/70"}`}>
          {value.length}
        </span>
      </div>
      {field.multiline ? (
        <AutoTextarea id={id} value={value} onChange={onChange} />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-stl-ink outline-none transition focus:border-stl-red focus:ring-2 focus:ring-stl-red/12"
        />
      )}
      {tooLong && (
        <p className="mt-1 text-[11px] text-amber-600">
          Özgün metinden belirgin uzun — tasarımda taşabilir.
        </p>
      )}
    </div>
  );
}

export function FieldRow({
  field,
  values,
  defaults,
  dirty,
  onChange,
  onReset,
}: {
  field: Field;
  values: Values;
  defaults: Values;
  dirty: boolean;
  onChange: (path: string, lang: Lang, v: string) => void;
  onReset: (path: string) => void;
}) {
  const cur = values[field.path] ?? { tr: field.trDefault, en: field.enDefault };
  const def = defaults[field.path] ?? { tr: field.trDefault, en: field.enDefault };
  const changed = cur.tr !== def.tr || cur.en !== def.en;

  return (
    <div className="py-3.5 first:pt-0 last:pb-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-stl-ink">{field.label}</span>
        {dirty && (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-stl-red"
            title="Kaydedilmemiş değişiklik"
          />
        )}
        {changed && (
          <button
            type="button"
            onClick={() => onReset(field.path)}
            className="ml-auto rounded px-1.5 py-0.5 text-[11px] text-muted transition hover:bg-stl-surface hover:text-stl-ink"
            title="Özgün metne dön"
          >
            ↺ özgün metin
          </button>
        )}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <LangInput
          field={field}
          lang="tr"
          value={cur.tr}
          defaultValue={def.tr}
          onChange={(v) => onChange(field.path, "tr", v)}
        />
        <LangInput
          field={field}
          lang="en"
          value={cur.en}
          defaultValue={def.en}
          onChange={(v) => onChange(field.path, "en", v)}
        />
      </div>
    </div>
  );
}

/** Kısa süre görünen bildirim */
export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2400);
    const t2 = setTimeout(onDone, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      role="status"
      className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stl-ink px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      {message}
    </div>
  );
}
