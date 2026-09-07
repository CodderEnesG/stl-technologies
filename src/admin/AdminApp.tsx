import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isConfigured } from "./supabase";
import { LoginForm } from "./LoginForm";
import { Editor } from "./Editor";

/** Panel arama motorlarına kapalı; site launch'ta indekse açılsa bile. */
function useNoIndex() {
  useEffect(() => {
    document.title = "İçerik Yönetimi — STL Teknoloji";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, []);
}

function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stl-surface px-6">
      <div className="max-w-md rounded-xl border border-border bg-white p-7">
        <h1 className="font-display text-lg font-bold text-stl-ink">Panel yapılandırılmamış</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Supabase bağlantı bilgileri tanımlı değil. Sitenin kendisi çalışmaya devam eder;
          metinler koddaki hâliyle görünür.
        </p>
        <p className="mt-4 text-sm text-muted">
          Kurulum için <code className="rounded bg-stl-surface px-1.5 py-0.5 text-xs">.env.example</code>{" "}
          dosyasındaki iki değişkeni tanımlayın.
        </p>
      </div>
    </div>
  );
}

export default function AdminApp() {
  useNoIndex();

  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!isConfigured);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!isConfigured) return <SetupNotice />;
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stl-surface">
        <p className="text-sm text-muted">Yükleniyor…</p>
      </div>
    );
  }
  if (!session) return <LoginForm />;
  return <Editor user={session.user} />;
}
