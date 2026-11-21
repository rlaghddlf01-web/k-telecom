import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { clientIp, rateLimit } from '@/lib/server/security';
import { TOOL_DECLARATIONS, runTool } from '@/lib/server/chatTools';

/**
 * 전화 AI 상담사(voice-agent)가 요금제·휴대폰·FAQ 를 찾을 때 부르는 주소.
 * 채팅 상담사와 같은 도구(chatTools)를 쓰므로 관리자에서 바꾼 내용이 전화에도 바로 반영된다.
 * VOICE_TOOL_SECRET 환경변수가 없으면 꺼져 있고, 헤더의 비밀값이 맞아야만 응답한다.
 */
export async function POST(req: Request) {
  const secret = process.env.VOICE_TOOL_SECRET;
  if (!secret) return NextResponse.json({ error: 'DISABLED' }, { status: 503 });

  const given = Buffer.from(req.headers.get('x-voice-secret') ?? '');
  const expected = Buffer.from(secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
  if (!rateLimit(`voice-tool:${clientIp(req)}`, 120, 60 * 1000)) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name : '';
  if (!TOOL_DECLARATIONS.some((t) => t.name === name)) return NextResponse.json({ error: 'BAD_TOOL' }, { status: 400 });
  const args = body?.args && typeof body.args === 'object' && !Array.isArray(body.args) ? body.args : {};
  return NextResponse.json({ result: await runTool(name, args) });
}
