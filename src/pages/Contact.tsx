import { useState } from "react";
import { company } from "../data/company";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { Arrow } from "../components/Arrow";

export default function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  usePageMeta(t.meta.contact.title, t.meta.contact.desc);

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [firm, setFirm] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${company.name} — ${name}${firm ? ` (${firm})` : ""}`;
    const body = `${message}\n\n—\n${name}\n${from}${firm ? `\n${firm}` : ""}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-5 pt-20 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{c.eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tightest md:text-7xl">{c.title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{c.lead}</p>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-14 px-5 py-16 md:grid-cols-[1fr_0.9fr] md:px-8">
        {/* Büyük tipografik iletişim bilgileri */}
        <div className="flex flex-col justify-between gap-12">
          <div className="space-y-9">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{c.phoneLabel}</p>
              <a
                href={company.phoneHref}
                className="mt-2 block font-display text-3xl font-bold tracking-tightest transition-colors hover:text-[var(--accent)] md:text-5xl"
              >
                {company.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{c.emailLabel}</p>
              <a
                href={`mailto:${company.email}`}
                className="mt-2 block break-all font-display text-2xl font-bold tracking-tightest transition-colors hover:text-[var(--accent)] md:text-4xl"
              >
                {company.email}
              </a>
            </div>
            <div className="grid gap-9 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{c.addressLabel}</p>
                <address className="mt-2 text-base not-italic leading-relaxed">
                  {company.addressLines.map((l) => (
                    <span key={l}>
                      {l}
                      <br />
                    </span>
                  ))}
                </address>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{c.hoursLabel}</p>
                <p className="mt-2 text-base leading-relaxed">
                  {company.hours}
                  <br />
                  <span className="text-muted">{company.weekend}</span>
                </p>
              </div>
            </div>
          </div>

          <a
            href={company.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-foreground"
          >
            Instagram <Arrow />
          </a>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="rounded-3xl border border-border bg-[var(--surface)] p-7 md:p-9">
          <h2 className="font-display text-xl font-bold tracking-tightest">{c.formTitle}</h2>
          <div className="mt-6 space-y-5">
            <Field label={c.nameLabel}>
              <input
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-border bg-transparent py-2.5 outline-none transition-colors focus:border-foreground"
              />
            </Field>
            <Field label={c.emailFieldLabel}>
              <input
                required
                type="email"
                name="email"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full border-b border-border bg-transparent py-2.5 outline-none transition-colors focus:border-foreground"
              />
            </Field>
            <Field label={c.companyLabel}>
              <input
                name="company"
                value={firm}
                onChange={(e) => setFirm(e.target.value)}
                className="w-full border-b border-border bg-transparent py-2.5 outline-none transition-colors focus:border-foreground"
              />
            </Field>
            <Field label={c.messageLabel}>
              <textarea
                required
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none border-b border-border bg-transparent py-2.5 outline-none transition-colors focus:border-foreground"
              />
            </Field>
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-[var(--accent)]"
            />
            <span>
              {c.kvkkText}{" "}
              <a href={company.kvkkUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {c.kvkkLink}
              </a>
            </span>
          </label>

          <button
            type="submit"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3.5 font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            {c.submit} <Arrow />
          </button>
          <p className="mt-3 text-xs text-muted">{c.submitNote}</p>
        </form>
      </section>

      {/* Gerçek harita */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-border">
          <iframe
            title={c.mapTitle}
            src={`https://www.google.com/maps?q=${encodeURIComponent(company.mapsQuery)}&output=embed`}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>
      {children}
    </label>
  );
}
