import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { clientIp, rateLimit } from '@/lib/server/security';
import { buildSnapshot } from '@/lib/server/chatTools';

/**
 * 전화 AI 상담사가 켜질 때(그리고 10분마다) 한 번에 받아 가는 전체 내용: 요금제·휴대폰·FAQ·안내 페이지·이벤트·공지·회사 정보.
 * 전화 프로그램이 이걸 메모리에 올려 두고 통화 중에는 인터넷 없이 바로 찾는다.
 * VOICE_TOOL_SECRET 환경변수가 없으면 꺼져 있고, 헤더의 비밀값이 맞아야만 응답한다.
 */
export async function GET(req: Request) {
  const secret = process.env.VOICE_TOOL_SECRET;
  if (!secret) return NextResponse.json({ error: 'DISABLED' }, { status: 503 });

  const given = Buffer.from(req.headers.get('x-voice-secret') ?? '');
  const expected = Buffer.from(secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
  if (!rateLimit(`voice-snapshot:${clientIp(req)}`, 20, 60 * 1000)) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  }
  return NextResponse.json(await buildSnapshot(), { headers: { 'cache-control': 'no-store' } });
}
