// 페이지별 선제 안내: 고객이 어느 페이지에서 막히는지에 맞춰 (1) 매니저가 먼저 건네는 말풍선,
// (2) 눌러서 바로 물어볼 수 있는 질문 버튼, (3) AI 가 알아야 할 "지금 보고 있는 화면" 설명을 정한다.
// teaser·chips 는 번역 키(한국어 문장)이고, topic 은 서버가 AI 에게만 전달하는 영어 설명이다.
// 클라이언트(화면)와 서버(API)가 같은 목록을 쓰므로, 서버는 화면이 보낸 id 가 이 목록에 있는지만 믿는다.

export interface PageHelp {
  id: string;
  match: (path: string) => boolean;
  /** 말풍선 문구 (없으면 관리자가 정한 기본 인사) */
  teaser?: string;
  /** 말풍선을 띄우기까지 기다리는 시간. 입력 중인 신청 화면은 방해되지 않게 오래 기다린다 */
  delayMs: number;
  chips: string[];
  topic: string;
}

/** 홈과 기본 화면에서 쓰는 자주 묻는 질문 */
export const QUICK_QUESTIONS = ['가장 저렴한 요금제는 무엇인가요?', '폰을 할부로 살 수 있나요?', '가입에 필요한 서류가 무엇인가요?', '개통까지 얼마나 걸리나요?'];

const GENERIC_TEASER = '궁금한 점이 있으신가요? 😊 여기서 바로 물어보세요!';

export const PAGE_HELPS: PageHelp[] = [
  {
    id: 'apply',
    match: (p) => p.startsWith('/plans/apply'),
    teaser: '가입 신청 중 막히는 부분이 있나요? 😊 필요한 서류와 순서를 바로 안내해 드릴게요!',
    delayMs: 15000,
    chips: ['신규가입과 번호이동은 무엇이 다른가요?', '유심과 eSIM 중 무엇을 고르나요?', '후불과 선불은 무엇이 다른가요?', '입력한 개인정보는 안전한가요?'],
    topic:
      'the sign-up (가입접수) form where the customer picks a plan and enters join type (new number or number porting), SIM type (USIM or eSIM), billing (postpaid or prepaid) and applicant details. Explain terms simply; never ask for personal data in chat.',
  },
  {
    id: 'esim',
    match: (p) => p.startsWith('/plans/esim'),
    teaser: 'eSIM 설정이 어려우신가요? 😊 쓰시는 폰 기종을 알려 주시면 순서를 안내해 드릴게요!',
    delayMs: 8000,
    chips: ['내 폰에서 eSIM을 쓸 수 있나요?', 'eSIM은 어떻게 설치하나요?', 'eSIM 설치 중 오류가 나면 어떻게 하나요?', '유심과 eSIM 중 무엇이 더 좋은가요?'],
    topic: 'the eSIM guide page with activation steps for Android and iPhone (Settings > cellular/connections > add eSIM, scan the QR code, finish activation).',
  },
  {
    id: 'plan-detail',
    match: (p) => p.startsWith('/plans/view/'),
    teaser: '이 요금제가 나에게 맞는지 궁금하신가요? 😊 사용 패턴을 알려 주시면 비교해 드릴게요!',
    delayMs: 8000,
    chips: ['이 요금제 할인은 언제까지인가요?', '비슷하면서 더 저렴한 요금제가 있나요?', '이 요금제로 가입하려면 어떻게 하나요?', '데이터를 다 쓰면 어떻게 되나요?'],
    topic: 'a plan detail page showing one plan (network, data, calls, SMS, list price, promo price and notes). Use the catalog for exact figures; if the customer asks about the plan they are viewing and it is unclear which one, ask which plan they mean.',
  },
  {
    id: 'plans',
    // 셀프개통·부가서비스 안내 화면은 "요금제 고르기" 화면이 아니므로 일반 안내로 넘긴다
    match: (p) => p.startsWith('/plans') && !p.startsWith('/plans/self') && !p.startsWith('/plans/addons'),
    teaser: '요금제를 고르고 계신가요? 😊 데이터와 통화량만 알려 주시면 맞는 요금제를 추천해 드릴게요!',
    delayMs: 6000,
    chips: ['데이터가 얼마나 필요한지 모르겠어요', '국제전화가 되는 요금제가 있나요?', 'SKT, KT, LGU+ 중 어떤 통신망이 좋나요?', '요금제는 나중에 바꿀 수 있나요?'],
    topic: 'the plan list page where the customer compares MVNO plans by network (SKT/KT/LGU+), data amount and price, with filters and sorting.',
  },
  {
    id: 'phones',
    match: (p) => p.startsWith('/phones'),
    teaser: '어떤 폰이 좋을지 고민되시나요? 😊 예산과 쓰는 방식을 알려 주시면 골라 드릴게요!',
    delayMs: 6000,
    chips: ['단말 할부는 어떻게 진행되나요?', '신용카드 없이도 할부가 되나요?', '리퍼비시 아이폰은 믿을 수 있나요?', '폰 값은 매달 얼마씩 내나요?'],
    topic: 'the phone list / phone detail page (brand-new Galaxy A series and certified refurbished iPhones, paid in 24 monthly installments added to the phone bill). Installment approval depends on screening; never promise approval.',
  },
  {
    id: 'internet',
    match: (p) => p.startsWith('/internet'),
    teaser: '원룸·기숙사 인터넷이 궁금하신가요? 😊 사는 곳 형태를 알려 주시면 안내해 드릴게요!',
    delayMs: 6000,
    chips: ['원룸에서도 인터넷을 설치할 수 있나요?', '설치 기사님은 언제 오시나요?', 'IPTV는 꼭 같이 가입해야 하나요?'],
    topic: 'the home internet and IPTV pages for studio apartments and dormitories. Exact products and install dates are confirmed by staff.',
  },
  {
    id: 'events',
    match: (p) => p.startsWith('/events'),
    teaser: GENERIC_TEASER,
    delayMs: 6000,
    chips: ['진행 중인 이벤트에는 어떻게 참여하나요?', '이벤트 혜택은 중복으로 받을 수 있나요?', '이벤트 대상은 누구인가요?'],
    topic: 'the events page. Event details are not in the catalog, so say that staff will confirm conditions.',
  },
  {
    id: 'support',
    match: (p) => p.startsWith('/support'),
    teaser: GENERIC_TEASER,
    delayMs: 12000,
    chips: ['문의는 어디로 하면 되나요?', '답변은 언제 받을 수 있나요?', '자주 묻는 질문에서 답을 찾지 못했어요', '직원과 직접 상담하고 싶어요'],
    topic: 'the support pages (notices, FAQ, 1:1 inquiry form). Point to the 1:1 inquiry page or the messenger buttons for staff help.',
  },
  {
    id: 'partnership',
    match: (p) => p.startsWith('/partnership'),
    teaser: GENERIC_TEASER,
    delayMs: 15000,
    chips: ['제휴 신청은 어떻게 하나요?', '어떤 제휴를 받고 있나요?', '신청 후 연락은 언제 오나요?'],
    topic: 'the partnership application page for companies that want to cooperate with K-Telecom. Do not promise outcomes or timing.',
  },
  {
    id: 'home',
    match: (p) => p === '/' || p === '',
    delayMs: 1500,
    chips: QUICK_QUESTIONS,
    topic: 'the home page of K-Telecom.',
  },
  {
    id: 'other',
    match: () => true,
    teaser: GENERIC_TEASER,
    delayMs: 6000,
    chips: QUICK_QUESTIONS,
    topic: 'an information page of the K-Telecom website.',
  },
];

/** 주소(언어 부분을 뗀 것)에 맞는 안내 */
export const helpForPath = (path: string): PageHelp => PAGE_HELPS.find((p) => p.match(path)) ?? PAGE_HELPS[PAGE_HELPS.length - 1];

/** 서버가 화면이 보낸 id 를 확인할 때 쓴다 (목록에 없으면 기본 화면으로 취급) */
export const helpById = (id: unknown): PageHelp => PAGE_HELPS.find((p) => p.id === id) ?? PAGE_HELPS[PAGE_HELPS.length - 1];
