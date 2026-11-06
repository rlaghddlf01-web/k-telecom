import { NextResponse } from 'next/server';
import { NETWORKS, findPlan } from '@/lib/plans';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ONE_OF = (v: unknown, list: string[]) => (typeof v === 'string' && list.includes(v) ? v : '');
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const data = {
    joinType: ONE_OF(body.joinType, ['new', 'port']),
    network: ONE_OF(body.network, NETWORKS),
    billing: ONE_OF(body.billing, ['post', 'pre']),
    planId: str(body.planId, 40),
    sim: ONE_OF(body.sim, ['usim', 'esim']),
    simBuy: ONE_OF(body.simBuy, ['buy', 'own']),
    name: str(body.name, 50),
    nationality: str(body.nationality, 40),
    phone: str(body.phone, 30),
    email: str(body.email, 100),
    wishNumber: str(body.wishNumber, 4),
    currentNumber: str(body.currentNumber, 20),
  };

  const plan = findPlan(data.planId);
  if (!data.joinType || !data.network || !data.billing || !data.sim || !data.simBuy || !plan || plan.network !== data.network) {
    return NextResponse.json({ error: '가입 정보를 올바르게 선택해 주세요.' }, { status: 400 });
  }
  if (!data.name || !data.nationality || !data.phone) {
    return NextResponse.json({ error: '필수 항목을 입력해 주세요.' }, { status: 400 });
  }
  if (data.email && !EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
  }
  if (data.joinType === 'port' && !data.currentNumber) {
    return NextResponse.json({ error: '현재 사용 중인 번호를 입력해 주세요.' }, { status: 400 });
  }
  if (data.wishNumber && !/^\d{4}$/.test(data.wishNumber)) {
    return NextResponse.json({ error: '희망번호는 숫자 4자리로 입력해 주세요.' }, { status: 400 });
  }
  if (body.agree !== true) {
    return NextResponse.json({ error: '개인정보 수집·이용에 동의해 주세요.' }, { status: 400 });
  }

  // TODO: 저장 방식(DB/메일) 연동 필요. 개인정보 보호를 위해 이름·연락처 등은 로그에 남기지 않는다.
  console.log('[apply] received', { network: data.network, planId: data.planId });

  return NextResponse.json({ ok: true });
}
