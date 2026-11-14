// 홈 화면 설정: 구역 순서·노출, 구역별 문구 바꾸기.
// 문구는 "기본 한국어 문장 → 바꿀 문장" 목록으로 저장합니다. 기본 문장이 곧 번역 키이므로
// 나중에 언어별 문구를 붙일 때도 같은 방식으로 확장할 수 있습니다.
import { CATEGORIES, PAIN_POINTS, PROCESS_STEPS } from '@/lib/site';

export interface HomeSectionDef {
  id: string;
  label: string;
}

/** 홈에 나오는 구역 (기본 순서) */
export const HOME_SECTIONS: HomeSectionDef[] = [
  { id: 'sister', label: '세금 환급·중고거래 서비스 배너' },
  { id: 'categories', label: '인기 카테고리' },
  { id: 'plans', label: '추천 요금제 BEST' },
  { id: 'deals', label: '이달의 추천 결합' },
  { id: 'best', label: '인기 스마트폰' },
  { id: 'promo', label: '중간 배너(3칸)' },
  { id: 'iphone', label: '리퍼비시 아이폰' },
  { id: 'featured', label: '추천 상품' },
  { id: 'showcase', label: '하단 배너' },
  { id: 'brands', label: '브랜드 로고' },
  { id: 'pain', label: '외국인 통신 해결 안내' },
  { id: 'process', label: '비대면 신청 단계' },
  { id: 'news', label: '최신 소식' },
  { id: 'support', label: '공지·고객센터·FAQ' },
  { id: 'features', label: '무료 배송 등 혜택 띠' },
  { id: 'partner', label: '제휴 신청 안내' },
];

export interface HomeSettings {
  /** 구역 id 를 보여줄 순서대로 */
  order: string[];
  /** 숨길 구역 id */
  hidden: string[];
  /** 기본 문장 → 바꾼 문장 */
  texts: Record<string, string>;
}

export const DEFAULT_HOME: HomeSettings = { order: HOME_SECTIONS.map((s) => s.id), hidden: [], texts: {} };

/**
 * 구역 순서 보정: 저장된 순서를 우선한다.
 * 저장된 순서에 없던 새 구역은 기본 순서에서 바로 뒤에 오는 구역 앞에 끼워 넣는다.
 */
export function resolveOrder(home: HomeSettings): string[] {
  const defaults = HOME_SECTIONS.map((s) => s.id);
  const known = new Set(defaults);
  const out: string[] = [];
  for (const id of home.order) {
    if (known.has(id) && !out.includes(id)) out.push(id);
  }
  defaults.forEach((id, i) => {
    if (out.includes(id)) return;
    const next = defaults.slice(i + 1).find((d) => out.includes(d));
    if (next) out.splice(out.indexOf(next), 0, id);
    else out.push(id);
  });
  return out;
}

export interface HomeTextGroup {
  group: string;
  texts: string[];
}

const uniq = (list: string[]) => [...new Set(list)];

/** 관리자 화면에 보여줄 "바꿀 수 있는 문구" 목록 (구역별) */
export const HOME_TEXT_GROUPS: HomeTextGroup[] = [
  {
    group: '세금 환급·중고거래 배너',
    texts: [
      'KTRS 외국인 생활 필수 원스톱 패밀리 서비스',
      '대한민국 국세청 조세특례제한법 제30조 외국인 법적 권리',
      '지나치기 쉬운 세금 환급,',
      '[5년간 최대 1,000만원]',
      '30초 무료 조회',
      '한국에서 일하며 낸 세금, 외국인 근로자도 평균 184만원 돌려받습니다. 내 나라 말로 지금 바로 확인해 보세요.',
      '소요시간 단 30초',
      '최대 1,000만원 수령',
      '선결제 0원 (100% 후불제)',
      '내 환급금 30초 무료 조회하기',
      'KTRS Market · 외국인 전용 18개국어 안심 직거래 장터',
      '귀국 무빙세일 최대 85% 특가!',
      '[가전·가구·자전거·아이폰]',
      '내 주변 직거래',
      '한국어를 못해도 OK! 18개국어 AI 실시간 번역 채팅으로 우리 공단·기숙사 앞에서 안전하게 중고 물품을 거래하세요.',
      '18개국어 AI 번역채팅',
      '귀국 무빙세일·0원 나눔',
      '수수료 0원 안심직거래',
      '내 모국어로 중고·무빙세일 장터 보기',
    ],
  },
  { group: '인기 카테고리', texts: uniq(['인기 카테고리', ...CATEGORIES.map((c) => c.label)]) },
  { group: '추천 요금제', texts: ['추천 요금제 BEST', '전체 요금제 보기'] },
  { group: '이달의 추천 결합', texts: ['이달의 추천 결합', '3중 결합 혜택', '단말 + 요금제 + 인터넷', '결합할수록 월 납부액이 줄어듭니다', '상품 보기', '결합 문의'] },
  { group: '인기 스마트폰', texts: ['인기 스마트폰', '전체 보기', '전체', '삼성 갤럭시', '애플 아이폰'] },
  { group: '리퍼비시 아이폰', texts: ['정품 검수 리퍼비시 아이폰', '아이폰 12 / 13 / 14', 'S급 정품 검수 · 초기비용 0원', '지금 신청'] },
  { group: '추천 상품', texts: ['추천 상품', '추천', '가장 많이 선택하는 구성입니다', '전체 상품 보기'] },
  { group: '외국인 통신 해결 안내', texts: uniq(['외국인 통신, 이렇게 해결합니다', ...PAIN_POINTS.flatMap((p) => [p.problem, p.solution])]) },
  { group: '비대면 신청 단계', texts: uniq(['100% 앱 안에서 비대면 신청', '외부 사이트로 이동하지 않고 모국어로 끝까지 신청합니다', ...PROCESS_STEPS.flatMap((s) => [s.title, s.desc])]) },
  { group: '최신 소식', texts: ['최신 소식'] },
  { group: '공지·고객센터·FAQ', texts: ['공지사항', '더보기', '등록된 공지가 없습니다.', '고객센터', '전화 또는 1:1 상담문의로 편하게 문의하세요.', '1:1 상담문의', '자주 묻는 질문', '등록된 질문이 없습니다.'] },
  {
    group: '혜택 띠',
    texts: ['무료 배송', '단말·유심 우체국 택배 발송', '모국어 안내', '요금제와 월 납부액을 내 나라 말로', '30초 비대면 접수', '신분증 OCR과 전자서명', '방문 설치', '인터넷은 전문 기사님이 설치'],
  },
  { group: '제휴 신청 안내', texts: ['통신 사업 제휴를 기다립니다', '단말, 알뜰폰, 인터넷·IPTV 제휴 문의를 접수하고 있습니다', '제휴 신청하기'] },
];

const MAX_TEXT = 200;

export type HomeChecked = { ok: true; value: HomeSettings } | { ok: false; error: string };

/** 저장·불러오기 공통 검사: 알 수 없는 구역·빈 문구는 버리고 길이를 제한한다 */
export function sanitizeHome(input: unknown): HomeChecked {
  if (!input || typeof input !== 'object') return { ok: false, error: '잘못된 요청입니다.' };
  const h = input as Record<string, unknown>;
  const known = new Set(HOME_SECTIONS.map((s) => s.id));
  const ids = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && known.has(x)) : []);

  const texts: Record<string, string> = {};
  if (h.texts && typeof h.texts === 'object' && !Array.isArray(h.texts)) {
    const entries = Object.entries(h.texts as Record<string, unknown>);
    if (entries.length > 300) return { ok: false, error: '바꾼 문구가 너무 많습니다.' };
    for (const [from, to] of entries) {
      if (typeof to !== 'string') continue;
      const next = to.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, MAX_TEXT);
      if (next && next !== from && from.length <= 300) texts[from] = next;
    }
  }

  const hidden = [...new Set(ids(h.hidden))];
  return { ok: true, value: { order: resolveOrder({ order: ids(h.order), hidden, texts }), hidden, texts } };
}
