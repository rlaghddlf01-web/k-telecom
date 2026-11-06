import { NextResponse } from 'next/server';
import { PARTNER_TYPES } from '@/lib/site';
import { saveSubmission } from '@/lib/server/submissions';

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

  // 저장소(Supabase)가 설정되어 있으면 저장하고, 없으면 저장하지 않는다. 개인정보는 로그에 남기지 않는다.
  const saved = await saveSubmission('partnership', {
    company: data.company,
    name: data.name,
    position: data.position || null,
    phone: data.phone,
    email: data.email,
    types: data.types,
    message: data.message || null,
  });
  if (saved.failed) {
    return NextResponse.json({ error: '접수 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
