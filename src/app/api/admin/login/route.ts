import { NextRequest, NextResponse } from 'next/server';
import {
  DEV_BYPASS,
  ADMIN_COOKIE,
  ADMIN_SESSION_MS,
  checkAdminCredentials,
  isAdminConfigured,
  isAdminRequest,
  issueAdminToken,
} from '@/lib/server/adminAuth';
import { clientIp, rateLimit } from '@/lib/server/security';

// GET /api/admin/login : 지금 로그인된 상태인지 확인
export async function GET(req: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminRequest(req),
    configured: isAdminConfigured(),
    // 로컬 개발(npm run dev)에서만 true: 로그인 없이 접속 중임을 화면에 알린다
    devBypass: DEV_BYPASS,
  });
}

// POST /api/admin/login : 아이디·비밀번호를 서버에서 확인하고 로그인 쿠키를 발급
export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { success: false, message: '관리자 계정이 설정되지 않았습니다. (ADMIN_ID / ADMIN_PASSWORD 환경변수 필요)' },
      { status: 503 },
    );
  }
  if (!rateLimit(`admin-login:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ success: false, message: '시도 횟수가 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !checkAdminCredentials(body.id, body.password)) {
    return NextResponse.json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, issueAdminToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(ADMIN_SESSION_MS / 1000),
  });
  return res;
}

// DELETE /api/admin/login : 로그아웃 (쿠키 삭제)
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
