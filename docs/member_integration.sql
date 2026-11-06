-- =============================================================================
-- 공통 회원 통합 스키마 (초안) — 아직 어디에도 실행하지 않았습니다.
-- 대상: KTRS(easy-tax-refund) / K-Market(ktrs-market) / K-Telecom 이 공유하는 Supabase 프로젝트
-- 원칙
--   1) 회원의 기준은 Supabase Auth(auth.users) 하나.
--   2) 신분증(외국인등록증) 원문은 서버에서만 다루고, 브라우저(anon/authenticated)는 접근 불가.
--   3) 앱마다 필요한 만큼만 보여준다 (K-Market 은 "인증 여부"만).
--   4) 열람·동의 기록을 남긴다.
-- 실행 전 반드시 Supabase 스테이징(또는 DB 백업)에서 먼저 검증하세요.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. 회원 프로필 (auth.users 와 1:1)
-- ---------------------------------------------------------------------------
create table if not exists public.member_profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  phone_e164     text not null unique,             -- +821012345678 형식
  display_name   text,
  nationality    text,                             -- ISO 3166-1 alpha-2 (VN, NP ...)
  preferred_lang text not null default 'ko',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 어느 앱을 쓰고 있는지
create table if not exists public.app_memberships (
  user_id       uuid not null references public.member_profiles(id) on delete cascade,
  app           text not null check (app in ('ktrs', 'kmarket', 'ktelecom')),
  first_seen_at timestamptz not null default now(),
  primary key (user_id, app)
);

-- ---------------------------------------------------------------------------
-- 2. 신분증 (OCR 결과) — 한 번 저장하면 세 앱에서 서버를 통해 사용
-- ---------------------------------------------------------------------------
create table if not exists public.identity_documents (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.member_profiles(id) on delete cascade,
  doc_type           text not null default 'arc' check (doc_type in ('arc', 'passport')),
  full_name_en       text,
  birth_date         date,
  nationality        text,
  visa_type          text,
  issue_date         date,
  expiry_date        date,
  -- 등록번호: 앱(서버) 계층에서 AES-256-GCM 으로 암호화한 문자열. 평문 저장 금지.
  number_enc         text not null,
  number_key_version smallint not null default 1,  -- 키 교체(rotation) 대비
  -- 같은 신분증으로 중복 가입 방지: HMAC-SHA256(서버 비밀값, 숫자만)
  number_hash        text not null,
  number_last4       text not null,
  ocr_confidence     numeric(4, 3),
  -- ocr_read: OCR 만 거침 / user_confirmed: 본인이 확인·수정 / partner_verified: 제휴사·통신사 진위확인 완료
  verification       text not null default 'ocr_read'
                     check (verification in ('ocr_read', 'user_confirmed', 'partner_verified')),
  -- 결정: 신분증 사진 원본은 저장하지 않고 OCR 결과만 남긴다 (이미지 컬럼·보관함 없음)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_id, doc_type)
);
create unique index if not exists identity_documents_number_hash_uq
  on public.identity_documents (doc_type, number_hash);

-- ---------------------------------------------------------------------------
-- 3. 동의 기록 (목적별) · 열람 기록
-- ---------------------------------------------------------------------------
create table if not exists public.consents (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.member_profiles(id) on delete cascade,
  purpose        text not null check (purpose in (
                   'identity_collect',       -- 신분증 정보 수집·이용
                   'ocr_overseas_transfer',  -- OCR 처리를 위한 해외 AI 서비스 전송
                   'tax_service',            -- 세무 환급 서비스 이용
                   'telecom_service',        -- 통신 가입 서비스 이용
                   'market_verified_badge')),-- K-Market 인증 배지 표시
  policy_version text not null,
  granted_at     timestamptz not null default now(),
  revoked_at     timestamptz
);
create index if not exists consents_user_idx on public.consents (user_id, purpose);

create table if not exists public.identity_access_log (
  id         bigint generated always as identity primary key,
  user_id    uuid not null,
  app        text not null,
  purpose    text not null,
  fields     text[] not null,                 -- 예: {name, arc_number}
  actor      text not null,                   -- 'user' | 'server:<route>' | 'admin:<id>'
  created_at timestamptz not null default now()
);
create index if not exists identity_access_log_user_idx on public.identity_access_log (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 4. 앱 간 이동용 1회용 코드 (도메인이 달라 세션을 공유할 수 없을 때)
-- ---------------------------------------------------------------------------
create table if not exists public.sso_handoff (
  code_hash  text primary key,                -- 코드 자체는 저장하지 않고 해시만 저장
  user_id    uuid not null references public.member_profiles(id) on delete cascade,
  from_app   text not null,
  to_app     text not null,
  expires_at timestamptz not null,            -- 발급 후 60초
  used_at    timestamptz
);

-- ---------------------------------------------------------------------------
-- 5. 기존 회원 이관용 매핑 (옛 ID → 새 user_id)
-- ---------------------------------------------------------------------------
create table if not exists public.legacy_user_map (
  legacy_app text not null check (legacy_app in ('kmarket', 'easytax')),
  legacy_id  text not null,                   -- kmarket_user_profiles.user_id / tax_applications.id
  user_id    uuid not null references public.member_profiles(id) on delete cascade,
  primary key (legacy_app, legacy_id)
);

-- ---------------------------------------------------------------------------
-- 6. 권한: 기본 거부 → 필요한 것만 허용
-- ---------------------------------------------------------------------------
alter table public.member_profiles     enable row level security;
alter table public.app_memberships     enable row level security;
alter table public.identity_documents  enable row level security;
alter table public.consents            enable row level security;
alter table public.identity_access_log enable row level security;
alter table public.sso_handoff         enable row level security;
alter table public.legacy_user_map     enable row level security;

revoke all on public.identity_documents, public.identity_access_log,
              public.sso_handoff, public.legacy_user_map
  from anon, authenticated;
-- 위 4개 테이블은 정책을 두지 않는다 = 브라우저에서는 읽기·쓰기 모두 불가 (서비스 키를 쓰는 서버만 가능)

create policy member_profiles_select_own on public.member_profiles
  for select to authenticated using (id = auth.uid());
create policy member_profiles_update_own on public.member_profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy app_memberships_select_own on public.app_memberships
  for select to authenticated using (user_id = auth.uid());

create policy consents_select_own on public.consents
  for select to authenticated using (user_id = auth.uid());
create policy consents_insert_own on public.consents
  for insert to authenticated with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. 화면에 보여줄 안전한 뷰
-- ---------------------------------------------------------------------------
-- (a) 내 신분증 요약: 마스킹된 값만, 본인 것만
create or replace view public.my_identity_summary as
  select user_id, doc_type, full_name_en, nationality, visa_type, expiry_date,
         number_last4, verification
  from public.identity_documents
  where user_id = auth.uid();
revoke all on public.my_identity_summary from anon;
grant select on public.my_identity_summary to authenticated;

-- (b) K-Market 공개 프로필: 인증 배지에 동의한 회원의 이름·국적·인증 여부만
create or replace view public.member_public_v as
  select p.id as user_id, p.display_name, p.nationality,
         exists (select 1 from public.identity_documents d
                 where d.user_id = p.id and d.verification in ('user_confirmed', 'partner_verified')) as is_verified
  from public.member_profiles p
  where exists (select 1 from public.consents c
                where c.user_id = p.id and c.purpose = 'market_verified_badge' and c.revoked_at is null);
grant select on public.member_public_v to anon, authenticated;

-- (신분증 이미지 보관함은 만들지 않습니다. OCR 요청이 끝나면 서버 메모리의 사진은 바로 버립니다.)
