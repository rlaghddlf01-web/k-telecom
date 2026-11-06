-- =============================================================================
-- K-Telecom 관리자: 배너 · 상품 · 요금제 · 이벤트 · 공지 · 자주 묻는 질문 · 서브 페이지 ·
--                   헤더/푸터/홈 설정 · 이미지 보관함
-- (Supabase SQL Editor 에서 한 번 실행)
--   · 기존 테이블은 건드리지 않고 새 테이블 8개와 이미지 보관함 1개만 추가합니다.
--   · RLS 를 켜고 정책을 만들지 않으므로 브라우저(공개 키)에서는 읽기·쓰기가 모두 막힙니다.
--     저장·조회는 서버(서비스 키)만 합니다.
--   · 이미지 보관함(telecom-media)은 공개 읽기: 사이트 방문자가 이미지를 볼 수 있어야 하기 때문입니다.
--     업로드는 서버(서비스 키)만 할 수 있습니다.
--   · i18n 컬럼: 나중에 17개국 번역을 넣기 위한 칸입니다. 형식 {"vi": {"title": "..."}, "en": {...}}
--     한국어는 본문 컬럼에 그대로 두고, 다른 언어만 i18n 에 넣습니다.
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
  ends_at      timestamptz,
  i18n         jsonb not null default '{}'::jsonb
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
  active       boolean not null default true,
  i18n         jsonb not null default '{}'::jsonb
);

create table if not exists public.telecom_plans (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  network      text not null check (network in ('SKT', 'KT', 'LGU+')),
  data_label   text not null default '',
  data_gb      integer not null default 0,        -- 정렬·필터용 데이터량(GB). 무제한은 999
  voice        text not null default '',
  sms          text not null default '',
  price        integer not null default 0,        -- 정상 요금(원)
  promo_price  integer not null default 0,        -- 할인 적용가(원)
  promo_note   text not null default '',
  features     text[] not null default '{}',
  badge        text not null default '',
  sort_order   integer not null default 0,
  active       boolean not null default true,
  i18n         jsonb not null default '{}'::jsonb
);

create table if not exists public.telecom_events (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  period       text not null default '',          -- 예: 상시 / 2026.11.01 ~ 2026.11.30
  body         text not null default '',          -- 줄바꿈으로 문단 구분
  published_at date not null default current_date,
  sort_order   integer not null default 0,
  active       boolean not null default true,
  i18n         jsonb not null default '{}'::jsonb
);

create table if not exists public.telecom_notices (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  period       text not null default '',
  body         text not null default '',
  published_at date not null default current_date,
  sort_order   integer not null default 0,
  active       boolean not null default true,
  i18n         jsonb not null default '{}'::jsonb
);

create table if not exists public.telecom_faqs (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  category     text not null default '기타',
  q            text not null,
  a            text not null,
  sort_order   integer not null default 0,
  active       boolean not null default true,
  i18n         jsonb not null default '{}'::jsonb
);

-- 서브 페이지 내용: 경로(path)마다 제목·설명·본문 블록을 저장한다.
--   · 기본 페이지(요금제 안내 등)는 이 표에 행이 있을 때만 그 내용으로 바꿔 보여주고, 행을 지우면 기본값으로 돌아간다.
--   · 관리자가 새로 만든 페이지도 이 표에 들어간다.
create table if not exists public.telecom_pages (
  path       text primary key check (path ~ '^/[a-z0-9][a-z0-9/_-]*$'),
  title      text not null default '',
  lead       text not null default '',
  blocks     jsonb,
  active     boolean not null default true,
  i18n       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- header / footer / home 화면 설정 (JSON)
create table if not exists public.telecom_settings (
  key        text primary key check (key in ('header', 'footer', 'home')),
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists telecom_banners_position_idx on public.telecom_banners (position, sort_order);
create index if not exists telecom_products_order_idx   on public.telecom_products (sort_order);
create index if not exists telecom_plans_order_idx      on public.telecom_plans (sort_order);
create index if not exists telecom_events_date_idx      on public.telecom_events (published_at desc);
create index if not exists telecom_notices_date_idx     on public.telecom_notices (published_at desc);

alter table public.telecom_banners  enable row level security;
alter table public.telecom_products enable row level security;
alter table public.telecom_plans    enable row level security;
alter table public.telecom_events   enable row level security;
alter table public.telecom_notices  enable row level security;
alter table public.telecom_faqs     enable row level security;
alter table public.telecom_pages    enable row level security;
alter table public.telecom_settings enable row level security;

revoke all on public.telecom_banners  from anon, authenticated;
revoke all on public.telecom_products from anon, authenticated;
revoke all on public.telecom_plans    from anon, authenticated;
revoke all on public.telecom_events   from anon, authenticated;
revoke all on public.telecom_notices  from anon, authenticated;
revoke all on public.telecom_faqs     from anon, authenticated;
revoke all on public.telecom_pages    from anon, authenticated;
revoke all on public.telecom_settings from anon, authenticated;

-- 이미지 보관함 (공개 읽기)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('telecom-media', 'telecom-media', true, 4194304, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do nothing;
