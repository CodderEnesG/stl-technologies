/**
 * Supabase istemcisi — yalnızca admin panelinde import edilir.
 *
 * Ziyaretçi tarafı içeriği düz `fetch` ile çeker (content/remote.ts), böylece
 * kütüphane bu chunk'ta kalır ve site bundle'ına girmez.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

/**
 * Yapılandırma yoksa null döner; panel "önce kurulum" ekranını gösterir.
 * Anon key herkese açıktır, yazma izni RLS ile korunur.
 */
export const supabase: SupabaseClient | null = isConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
