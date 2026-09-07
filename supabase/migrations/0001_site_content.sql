-- Site metinleri: sayfa başına bir satır, dil başına bir jsonb.
--
-- Saklanan yapı düz bir "yol -> metin" haritasıdır:
--   {"brands.wexta.about.title": "...", "home.stats.1.n": "35.000 m²"}
-- Yalnızca koddaki özgün metinden FARKLI olan alanlar yazılır; dokunulmamış
-- metin kodda (src/content/tr.ts, en.ts) kalır ve orası tek doğruluk kaynağıdır.

create table if not exists public.site_content (
  page       text primary key check (page in ('home', 'wexta', 'fressi', 'bnk', 'oxyra')),
  tr         jsonb not null default '{}'::jsonb,
  en         jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

-- Her kaydetmeden önceki hâl buraya düşer; panelde "Geçmiş" bunu okur.
create table if not exists public.site_content_revisions (
  id       bigint generated always as identity primary key,
  page     text not null,
  tr       jsonb not null,
  en       jsonb not null,
  saved_at timestamptz not null,
  saved_by uuid
);

create index if not exists site_content_revisions_page_saved_at_idx
  on public.site_content_revisions (page, saved_at desc);

alter table public.site_content enable row level security;
alter table public.site_content_revisions enable row level security;

-- Site metinleri herkese açık okunur (ziyaretçi anon key ile çeker).
drop policy if exists "site_content_public_read" on public.site_content;
create policy "site_content_public_read"
  on public.site_content for select
  using (true);

-- Yazma yalnızca giriş yapmış panel kullanıcılarına.
drop policy if exists "site_content_auth_insert" on public.site_content;
create policy "site_content_auth_insert"
  on public.site_content for insert to authenticated
  with check (true);

drop policy if exists "site_content_auth_update" on public.site_content;
create policy "site_content_auth_update"
  on public.site_content for update to authenticated
  using (true) with check (true);

-- Geçmiş yalnızca panel kullanıcılarına görünür; yazan tek şey trigger.
drop policy if exists "site_content_revisions_auth_read" on public.site_content_revisions;
create policy "site_content_revisions_auth_read"
  on public.site_content_revisions for select to authenticated
  using (true);

create or replace function public.snapshot_site_content()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_content_revisions (page, tr, en, saved_at, saved_by)
  values (old.page, old.tr, old.en, old.updated_at, old.updated_by);
  return new;
end;
$$;

drop trigger if exists site_content_snapshot on public.site_content;
create trigger site_content_snapshot
  before update on public.site_content
  for each row execute function public.snapshot_site_content();
