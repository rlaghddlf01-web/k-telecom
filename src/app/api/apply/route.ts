import { NextResponse } from 'next/server';
import { NETWORKS } from '@/lib/plans';
import { getPlan } from '@/lib/content/load';
import { saveSubmission } from '@/lib/server/submissions';

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

  const plan = await getPlan(data.planId);
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

  // 저장소(Supabase)가 설정되어 있으면 저장하고, 없으면 저장하지 않는다. 개인정보는 로그에 남기지 않는다.
  const saved = await saveSubmission('application', {
    join_type: data.joinType,
    network: data.network,
    billing: data.billing,
    plan_id: plan.id,
    plan_name: plan.name,
    sim: data.sim,
    sim_buy: data.simBuy,
    name: data.name,
    nationality: data.nationality,
    phone: data.phone,
    email: data.email || null,
    wish_number: data.wishNumber || null,
    current_number: data.currentNumber || null,
  });
  if (saved.failed) {
    return NextResponse.json({ error: '접수 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
