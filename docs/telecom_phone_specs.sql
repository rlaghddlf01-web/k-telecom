-- 휴대폰 사양·번역 저장용 (Supabase SQL Editor 에서 한 번 실행하세요. 여러 번 실행해도 안전합니다)
--
-- 1) 상품(휴대폰)에 사양 표, 제조사 공식 페이지 주소, 새 제품 여부 칸을 추가합니다.
--    specs 형식: [["화면 크기", "6.9\" (174.9mm)"], ["배터리", "5,000mAh"], ...]
-- 2) 번역 저장소: 한 번 번역한 문구를 언어별로 저장해 두고 다시 꺼내 씁니다.
--    새 휴대폰이 나오거나 문구가 바뀌어도 이미 번역한 것은 다시 번역하지 않습니다.
--    origin: 'ai' = 자동 번역, 'manual' = 사람이 직접 고친 번역 (직접 고친 것이 자동 번역보다 우선)

alter table public.telecom_products add column if not exists specs jsonb not null default '[]'::jsonb;
alter table public.telecom_products add column if not exists official_url text not null default '';
alter table public.telecom_products add column if not exists is_new boolean not null default false;

create table if not exists public.telecom_translations (
  lang        text not null,
  source      text not null,
  target      text not null,
  origin      text not null default 'ai' check (origin in ('ai', 'manual')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (lang, source)
);

-- 서버(service role)만 읽고 씁니다. 브라우저에서는 접근할 수 없게 정책을 만들지 않습니다.
alter table public.telecom_translations enable row level security;
