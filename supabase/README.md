# İçerik yönetimi — kurulum

Panel `/admin` adresinde çalışır. Metinler Supabase'te tutulur; Supabase
erişilemezse site koddaki metinlerle (`src/content/tr.ts`, `en.ts`) çalışmaya
devam eder.

## 1. Supabase projesi

1. https://supabase.com üzerinde yeni proje aç (bölge: Frankfurt).
2. **SQL Editor** → `migrations/0001_site_content.sql` içeriğini yapıştır ve çalıştır.
   (CLI ile: `supabase link --project-ref <ref}` ardından `supabase db push`.)
3. **Authentication → Providers → Email**: "Enable Sign Up" kapalı olsun.
   Panel kayıt almaz, kullanıcılar elle tanımlanır.
4. **Authentication → Users → Add user**: müşterinin e-postası ve bir şifre.

## 2. Ortam değişkenleri

`Project Settings → API` altındaki iki değeri al:

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

- Yerelde: `.env.local` dosyasına yaz (git'e girmez).
- Vercel'de: `vercel env add VITE_SUPABASE_URL production` ve aynısı anon key için.

`anon` anahtarı tarayıcıya açıktır, normaldir: yazma izni RLS ile giriş yapmış
kullanıcılara kısıtlıdır. `service_role` anahtarı **hiçbir zaman** bu projeye
konmaz.

## 3. Veri modeli

`site_content` tablosunda sayfa başına bir satır vardır (`home`, `wexta`,
`fressi`, `bnk`, `oxyra`). `tr` ve `en` sütunları düz bir harita tutar:

```json
{ "brands.wexta.about.title": "Fabrikadan çıkan valiz, yolculuğa hazır." }
```

Yalnızca özgün metinden farklı alanlar yazılır. Panelde "↺ özgün metin"
denince kayıt haritadan çıkar ve alan yeniden kodun metnini gösterir.

Her kaydetmede bir önceki hâl `site_content_revisions` tablosuna düşer;
panelin "Geçmiş" bölümü son 20 sürümü listeler.
