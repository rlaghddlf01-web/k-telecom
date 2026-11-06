-- =============================================================================
-- K-Telecom 관리자: 배너 · 상품 · 헤더/푸터 설정 · 이미지 보관함 (Supabase SQL Editor 에서 한 번 실행)
--   · 기존 테이블은 건드리지 않고 새 테이블 3개와 이미지 보관함 1개만 추가합니다.
--   · RLS 를 켜고 정책을 만들지 않으므로 브라우저(공개 키)에서는 읽기·쓰기가 모두 막힙니다.
--     저장·조회는 서버(서비스 키)만 합니다.
--   · 이미지 보관함(telecom-media)은 공개 읽기: 사이트 방문자가 이미지를 볼 수 있어야 하기 때문입니다.
--     업로드는 서버(서비스 키)만 할 수 있습니다.
-- =============================================================================

create table if not exists public.telecom_banners (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  position     text not null check (position in ('top_strip', 'hero', 'promo', 'showcase', 'popup')),
  title        text not null default '',
  eyebrow      text not null default '',
  description  text not null default '',
  button_label text not null default '',
  link_url     text not null default '',
  image_url    text not null default '',
  theme        text not null default 'violet' check (theme in ('violet', 'sky', 'rose', 'orange', 'blue', 'navy')),
  sort_order   integer not null default 0,
  active       boolean not null default true,
  starts_at    timestamptz,
  ends_at      timestamptz
);

create table if not exists public.telecom_products (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  grp          text not null default 'galaxy' check (grp in ('galaxy', 'iphone', 'budget')),
  tag          text not null default '',
  title        text not null,
  price        text not null default '',
  note         text not null default '',
  badge        text not null default '',
  description  text not null default '',
  image_url    text not null default '',
  -- 사진이 없을 때 보여줄 폰 목업 모양과 색
  kind         text not null default 'punch' check (kind in ('punch', 'island', 'back')),
  color_from   text not null default '#6d5dfc',
  color_to     text not null default '#e8174f',
  sort_order   integer not null default 0,
  active       boolean not null default true
);

create table if not exists public.telecom_settings (
  key        text primary key check (key in ('header', 'footer')),
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists telecom_banners_position_idx on public.telecom_banners (position, sort_order);
create index if not exists telecom_products_order_idx   on public.telecom_products (sort_order);

alter table public.telecom_banners  enable row level security;
alter table public.telecom_products enable row level security;
alter table public.telecom_settings enable row level security;

revoke all on public.telecom_banners  from anon, authenticated;
revoke all on public.telecom_products from anon, authenticated;
revoke all on public.telecom_settings from anon, authenticated;

-- 이미지 보관함 (공개 읽기)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('telecom-media', 'telecom-media', true, 4194304, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do nothing;
