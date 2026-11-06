// 관리자 확인 (서버 전용).
// 아이디·비밀번호는 코드에 적지 않고 Vercel 환경변수 ADMIN_ID / ADMIN_PASSWORD 로만 받는다.
import type { NextRequest } from 'next/server';
import { safeEqual, signToken, verifyToken } from '@/lib/server/security';

export const ADMIN_COOKIE = 'kt_admin';
export const ADMIN_SESSION_MS = 12 * 60 * 60 * 1000;

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

/** 요청의 관리자 쿠키가 유효한지 */
export function isAdminRequest(req: NextRequest): boolean {
  const payload = verifyToken<{ role: string; exp: number }>(req.cookies.get(ADMIN_COOKIE)?.value, 'ADMIN_SESSION_SECRET');
  return !!payload && payload.role === 'admin' && payload.exp > Date.now();
}
