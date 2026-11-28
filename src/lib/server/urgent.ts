import 'server-only';
import { saveSubmission } from '@/lib/server/submissions';
import { sendKakaoMemo } from '@/lib/server/kakaoNotify';

/**
 * 긴급 알림: 채팅·전화 AI(김서연 매니저)가 "사장님이 꼭 알아야 할 일"을 올린다.
 * 새 테이블 없이 상담문의 표에 "[긴급:종류]" 머리말을 붙여 저장하고, 관리자 화면이 이 머리말로 긴급 칸을 만든다.
 * 카카오톡 알림 설정이 있으면 사장님 카카오톡으로도 한 줄 요약을 보낸다.
 */
export const URGENT_TYPES = {
  usim_not_delivered: '유심 미배송',
  usim_not_recognized: '유심 인식 불가',
  other_urgent: '기타 긴급',
} as const;
export type UrgentType = keyof typeof URGENT_TYPES;

export const URGENT_PREFIX = '[긴급:';

const SOURCES = { chat: '채팅', phone: '전화' } as const;

// 같은 내용이 짧은 시간에 여러 번 올라오거나, 한꺼번에 너무 많이 올라오는 것을 막는다 (서버 메모리 기준)
const recent = new Map<string, number>();
let windowStart = Date.now();
let windowCount = 0;

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');

/** 숫자 9자리 이상이 붙은 것은 주민·등록·카드·계좌번호일 수 있어 가린다 (연락처는 따로 받는다) */
const scrub = (s: string) => s.replace(/\d[\d\-\s]{8,}\d/g, '[숫자 가림]');

export async function reportUrgent(args: Record<string, unknown>): Promise<string> {
  const type = (typeof args.type === 'string' && args.type in URGENT_TYPES ? args.type : 'other_urgent') as UrgentType;
  const summary = scrub(clean(args.summary, 400));
  const contact = clean(args.contact, 30);
  const source = args.source === 'phone' ? 'phone' : 'chat';
  if (!summary) return '요약이 비어 있어 전달하지 못했습니다. 상황을 한 줄로 정리해서 다시 시도하세요.';

  const now = Date.now();
  if (now - windowStart > 60 * 60 * 1000) { windowStart = now; windowCount = 0; recent.clear(); }
  const key = `${type}|${summary}`;
  if (recent.has(key)) return '같은 내용이 이미 담당자에게 전달되었습니다. 고객에게 담당자가 확인한다고 안내하세요.';
  if (windowCount >= 30) return '지금은 전달 요청이 너무 많아 접수하지 못했습니다. 고객에게 1:1 상담문의를 남기도록 안내하세요.';
  windowCount += 1;
  recent.set(key, now);

  const label = URGENT_TYPES[type];
  const saved = await saveSubmission('inquiry', {
    name: `긴급 보고(${SOURCES[source]})`,
    phone: contact || '-',
    email: null,
    category: '기타',
    message: `${URGENT_PREFIX}${label}] ${summary}`,
  });
  const kakao = await sendKakaoMemo(`🚨 긴급(${label}·${SOURCES[source]})\n${summary}${contact ? `\n연락처: ${contact}` : ''}`);

  if (saved.failed && !kakao) return '담당자에게 전달하지 못했습니다. 고객에게 1:1 상담문의를 남기거나 대표 전화로 연락하도록 안내하세요.';
  return '담당자에게 긴급으로 전달했습니다. 고객에게는 "담당자에게 전달했고, 확인되는 대로 연락드린다"까지만 말하고, 해결을 약속하거나 시간을 장담하지 마세요.';
}
