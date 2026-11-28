import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/server/security';
import { saveSubmission } from '@/lib/server/submissions';
import { sendKakaoMemo } from '@/lib/server/kakaoNotify';
import { DATA_PRODUCTS, RECHARGE_KINDS, RECHARGE_PREFIX, VOICE_AMOUNTS, type RechargeKind } from '@/lib/recharge';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** 선불 충전 요청 접수: 번호·종류·상품만 저장한다. 결제 정보는 받지 않는다. */
export async function POST(req: Request) {
  if (!rateLimit(`recharge:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });

  const phone = str(body.phone, 20).replace(/\D/g, '');
  if (!/^010\d{8}$/.test(phone)) {
    return NextResponse.json({ error: '휴대폰 번호 11자리를 010으로 시작하게 입력해 주세요.' }, { status: 400 });
  }
  const kind = body.kind as RechargeKind;
  if (!(kind in RECHARGE_KINDS)) return NextResponse.json({ error: '충전 종류를 선택해 주세요.' }, { status: 400 });

  let item = '';
  if (kind === 'data') {
    item = str(body.item, 60);
    if (!(DATA_PRODUCTS as readonly string[]).includes(item)) return NextResponse.json({ error: '상품을 선택해 주세요.' }, { status: 400 });
  } else {
    const amount = Number(body.item);
    if (!(VOICE_AMOUNTS as readonly number[]).includes(amount)) return NextResponse.json({ error: '충전 금액을 선택해 주세요.' }, { status: 400 });
    item = `${amount.toLocaleString('ko-KR')}원`;
  }
  if (body.agree !== true) return NextResponse.json({ error: '개인정보 수집·이용에 동의해 주세요.' }, { status: 400 });

  // 같은 번호가 짧은 시간에 반복 접수되는 것을 막는다
  if (!rateLimit(`recharge-phone:${phone}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: '같은 번호로 요청이 이미 접수되었습니다. 담당자가 확인하고 있습니다.' }, { status: 429 });
  }

  const label = RECHARGE_KINDS[kind];
  const saved = await saveSubmission('inquiry', {
    name: '충전요청',
    phone,
    email: null,
    category: '기타',
    message: `${RECHARGE_PREFIX}${label}] ${item}`,
  });
  if (saved.failed) return NextResponse.json({ error: '접수 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 500 });

  // 사장님 카카오톡 알림 (설정이 없으면 보내지 않음). 번호는 알림에 넣지 않고 관리자 화면에서 본다.
  await sendKakaoMemo(`💳 선불 충전 요청 (${label})\n${item}\n관리자 화면에서 번호를 확인하세요.`);
  return NextResponse.json({ ok: true });
}
