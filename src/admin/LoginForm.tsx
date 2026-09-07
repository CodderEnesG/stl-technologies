import { useState, type FormEvent } from "react";
import { supabase } from "./supabase";
import { StlLogo } from "../components/Logo";

/**
 * Panel girişi. Kayıt olma yok — kullanıcılar Supabase panelinden tanımlanır.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(
        err.message.toLowerCase().includes("invalid")
          ? "E-posta veya şifre hatalı."
          : "Giriş yapılamadı. Daha sonra tekrar deneyin.",
      );
      setBusy(false);
    }
    // Başarılıysa oturum dinleyicisi paneli açar; busy'yi bırakmaya gerek yok.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stl-surface px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <StlLogo size={40} />
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-border bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <h1 className="font-display text-xl font-bold tracking-tight text-stl-ink">
            İçerik Yönetimi
          </h1>
          <p className="mt-1 mb-6 text-sm text-muted">Devam etmek için giriş yapın.</p>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-semibold text-stl-ink">E-posta</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-stl-red focus:ring-2 focus:ring-stl-red/15"
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-1.5 block text-xs font-semibold text-stl-ink">Şifre</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-stl-red focus:ring-2 focus:ring-stl-red/15"
            />
          </label>

          {error && (
            <p className="mb-4 rounded-md bg-stl-red/8 px-3 py-2 text-sm text-stl-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-stl-red px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            {busy ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Şifrenizi unuttuysanız site yöneticinize başvurun.
        </p>
      </div>
    </div>
  );
}
