import { NextResponse } from 'next/server';
import { saveSubmission } from '@/lib/server/submissions';

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

  // 저장소(Supabase)가 설정되어 있으면 저장하고, 없으면 저장하지 않는다. 개인정보는 로그에 남기지 않는다.
  const saved = await saveSubmission('inquiry', {
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    category: data.category,
    message: data.message,
  });
  if (saved.failed) {
    return NextResponse.json({ error: '접수 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
