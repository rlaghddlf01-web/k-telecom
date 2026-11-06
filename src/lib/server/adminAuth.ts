// 관리자 확인 (서버 전용).
// 아이디·비밀번호는 코드에 적지 않고 Vercel 환경변수 ADMIN_ID / ADMIN_PASSWORD 로만 받는다.
import type { NextRequest } from 'next/server';
import { safeEqual, signToken, verifyToken } from '@/lib/server/security';

export const ADMIN_COOKIE = 'kt_admin';
export const ADMIN_SESSION_MS = 12 * 60 * 60 * 1000;

/**
 * 로컬 개발 전용 우회: `npm run dev`(NODE_ENV=development)일 때만 로그인 없이 관리자로 인정한다.
 * Vercel 배포(미리보기·운영)는 항상 NODE_ENV=production 이므로 이 값이 켜지지 않는다.
 */
export const DEV_BYPASS = process.env.NODE_ENV === 'development';

/** 관리자 계정이 설정되어 있는지 (설정이 없으면 로그인을 막는다) */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_ID && process.env.ADMIN_PASSWORD);
}

export function checkAdminCredentials(id: unknown, password: unknown): boolean {
  if (!isAdminConfigured() || typeof id !== 'string' || typeof password !== 'string') return false;
  const idOk = safeEqual(id.trim(), process.env.ADMIN_ID as string);
  const pwOk = safeEqual(password, process.env.ADMIN_PASSWORD as string);
  return idOk && pwOk;
}

export function issueAdminToken(): string {
  return signToken({ role: 'admin', exp: Date.now() + ADMIN_SESSION_MS }, 'ADMIN_SESSION_SECRET');
}

/** 요청의 관리자 쿠키가 유효한지 (로컬 개발 모드에서는 항상 true) */
export function isAdminRequest(req: NextRequest): boolean {
  if (DEV_BYPASS) return true;
  const payload = verifyToken<{ role: string; exp: number }>(req.cookies.get(ADMIN_COOKIE)?.value, 'ADMIN_SESSION_SECRET');
  return !!payload && payload.role === 'admin' && payload.exp > Date.now();
}
