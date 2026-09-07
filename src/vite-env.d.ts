/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase proje URL'i — admin panelinde kaydedilen metinler buradan okunur */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon key — herkese açık, yazma izni RLS ile korunur */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
