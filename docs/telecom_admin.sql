-- =============================================================================
-- K-Telecom 관리자 페이지용 저장 테이블 (Supabase SQL Editor 에서 한 번 실행)
--   · 가입접수 / 상담문의 / 제휴신청 3종을 저장합니다.
--   · RLS 를 켜고 정책을 만들지 않으므로 브라우저(공개 키)에서는 읽기·쓰기가 모두 막힙니다.
--     저장·조회는 서버(서비스 키)만 합니다.
--   · 공용 Supabase 프로젝트에 새 테이블만 추가합니다 (기존 테이블은 건드리지 않음).
-- =============================================================================

create table if not exists public.telecom_applications (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  status         text not null default 'new' check (status in ('new', 'contacted', 'done', 'cancelled')),
  memo           text not null default '',
  join_type      text not null check (join_type in ('new', 'port')),
  network        text not null,
  billing        text not null check (billing in ('post', 'pre')),
  plan_id        text not null,
  plan_name      text not null,
  sim            text not null check (sim in ('usim', 'esim')),
  sim_buy        text not null check (sim_buy in ('buy', 'own')),
  name           text not null,
  nationality    text not null,
  phone          text not null,
  email          text,
  wish_number    text,
  current_number text
);

create table if not exists public.telecom_inquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status     text not null default 'new' check (status in ('new', 'contacted', 'done', 'cancelled')),
  memo       text not null default '',
  name       text not null,
  phone      text not null,
  email      text,
  category   text not null,
  message    text not null
);

create table if not exists public.telecom_partnerships (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status     text not null default 'new' check (status in ('new', 'contacted', 'done', 'cancelled')),
  memo       text not null default '',
  company    text not null,
  name       text not null,
  position   text,
  phone      text not null,
  email      text not null,
  types      text[] not null default '{}',
  message    text
);

create index if not exists telecom_applications_created_idx on public.telecom_applications (created_at desc);
create index if not exists telecom_inquiries_created_idx    on public.telecom_inquiries (created_at desc);
create index if not exists telecom_partnerships_created_idx on public.telecom_partnerships (created_at desc);
create index if not exists telecom_applications_status_idx  on public.telecom_applications (status);
create index if not exists telecom_inquiries_status_idx     on public.telecom_inquiries (status);
create index if not exists telecom_partnerships_status_idx  on public.telecom_partnerships (status);

-- 브라우저(공개 키)에서는 접근 불가: RLS 켜고 정책을 만들지 않음 + 권한 회수
alter table public.telecom_applications enable row level security;
alter table public.telecom_inquiries    enable row level security;
alter table public.telecom_partnerships enable row level security;

revoke all on public.telecom_applications from anon, authenticated;
revoke all on public.telecom_inquiries    from anon, authenticated;
revoke all on public.telecom_partnerships from anon, authenticated;
