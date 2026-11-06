-- =============================================================================
-- 0단계: 긴급 보안 패치 (초안) — 아직 실행하지 않았습니다.
--
-- ⚠ 실행 순서가 중요합니다.
--   아래 정책을 지우면 브라우저(anon 키)에서 이 테이블을 직접 읽고 쓰던 화면이 즉시 멈춥니다.
--   1) 먼저 앱 코드를 "서버 API(서비스 키)" 경유로 바꾸고 배포한다.
--   2) 그 다음 이 SQL 을 실행한다.
--
-- 이유 (ktrs-market/supabase_schema.sql 기준):
--   - kmarket_sms_logs          : 정책이 FOR ALL USING (true) → 누구나 다른 사람의 SMS 인증번호(auth_code)를 읽을 수 있음
--   - kmarket_tax_refund_leads  : 정책이 FOR ALL USING (true) → 누구나 외국인등록번호·연락처를 읽고 수정할 수 있음
--   - kmarket_user_profiles     : SELECT·ALL 모두 true → 전화번호, 등록번호 해시, 신분증 이미지 경로가 전체 공개
--   anon 키는 브라우저에 공개되는 값이라, 위 정책이면 REST 주소를 직접 호출해도 같은 결과를 얻습니다.
-- =============================================================================

-- 1) 인증번호 로그: 브라우저 접근 전면 차단 (서버가 서비스 키로만 사용)
drop policy if exists "Anyone can insert sms logs" on public.kmarket_sms_logs;
revoke all on public.kmarket_sms_logs from anon, authenticated;

-- 2) 세무 환급 신청: 브라우저 접근 전면 차단 (서버 API 경유로 전환)
drop policy if exists "Users can view and insert tax leads" on public.kmarket_tax_refund_leads;
revoke all on public.kmarket_tax_refund_leads from anon, authenticated;

-- 3) 회원 프로필: 전체 공개 정책 제거. 공개용은 member_public_v 뷰(통합 스키마)로 대체
drop policy if exists "Public user profiles are viewable by everyone" on public.kmarket_user_profiles;
drop policy if exists "Anyone can upsert user profiles" on public.kmarket_user_profiles;
revoke all on public.kmarket_user_profiles from anon, authenticated;

-- 4) 신분증 이미지 업로드 정책: 익명 업로드 제거 (서버가 서비스 키로 업로드)
drop policy if exists "Secure Upload for ID Cards" on storage.objects;

-- ---------------------------------------------------------------------------
-- easy-tax-refund 쪽은 이 저장소에 tax_applications 의 테이블·정책 정의가 없습니다.
-- Supabase 대시보드 > Authentication > Policies 에서 아래를 직접 확인하세요.
--   - tax_applications 에 anon 이 SELECT / UPDATE / DELETE 할 수 있는 정책이 있는가
--   - chat_messages, chat_rooms 가 "anon SELECT using (true)" 라서 모든 상담 내용이 공개되어 있지 않은가
-- 확인용 쿼리:
--   select schemaname, tablename, policyname, roles, cmd, qual
--   from pg_policies where schemaname = 'public' order by tablename, policyname;
-- =============================================================================
