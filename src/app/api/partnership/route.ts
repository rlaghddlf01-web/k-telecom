import { NextResponse } from 'next/server';
import { PARTNER_TYPES } from '@/lib/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const data = {
    company: str(body.company, 100),
    name: str(body.name, 50),
    position: str(body.position, 50),
    phone: str(body.phone, 30),
    email: str(body.email, 100),
    types: Array.isArray(body.types)
      ? body.types.filter((x: unknown): x is string => typeof x === 'string' && PARTNER_TYPES.includes(x))
      : [],
    message: str(body.message, 2000),
  };

  if (!data.company || !data.name || !data.phone || !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: '필수 항목을 올바르게 입력해 주세요.' }, { status: 400 });
  }
  if (data.types.length === 0) {
    return NextResponse.json({ error: '제휴 유형을 하나 이상 선택해 주세요.' }, { status: 400 });
  }
  if (body.agree !== true) {
    return NextResponse.json({ error: '개인정보 수집·이용에 동의해 주세요.' }, { status: 400 });
  }

  // TODO: 저장 방식(DB/메일) 연동 필요. 개인정보 보호를 위해 이름·연락처 등은 로그에 남기지 않는다.
  console.log('[partnership] received', { types: data.types });

  return NextResponse.json({ ok: true });
}
