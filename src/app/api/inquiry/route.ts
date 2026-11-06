import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORIES = ['요금제', '스마트폰', '인터넷·IPTV', '이벤트', '기타'];

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const data = {
    name: str(body.name, 50),
    phone: str(body.phone, 30),
    email: str(body.email, 100),
    category: str(body.category, 30),
    message: str(body.message, 2000),
  };

  if (!data.name || !data.phone || !data.message || !CATEGORIES.includes(data.category)) {
    return NextResponse.json({ error: '필수 항목을 올바르게 입력해 주세요.' }, { status: 400 });
  }
  if (data.email && !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
  }
  if (body.agree !== true) {
    return NextResponse.json({ error: '개인정보 수집·이용에 동의해 주세요.' }, { status: 400 });
  }

  // TODO: 저장 방식 확정 전까지는 서버 로그에만 남깁니다 (DB/메일 연동 필요).
  console.log('[inquiry]', JSON.stringify(data));

  return NextResponse.json({ ok: true });
}
