// 관리자 입력 양식 정의 (서버·브라우저 공용, 데이터만 있음).
// 같은 정의로 ① 관리자 화면의 입력 양식을 자동으로 만들고 ② 서버에서 저장 전에 검사한다.

export type FieldDef =
  | { kind: 'text'; key: string; label: string; hint?: string; max?: number; multiline?: boolean; placeholder?: string; required?: boolean }
  | { kind: 'number'; key: string; label: string; hint?: string; min?: number; max?: number }
  | { kind: 'select'; key: string; label: string; hint?: string; options: { value: string; label: string }[] }
  | { kind: 'link'; key: string; label: string; hint?: string; placeholder?: string }
  | { kind: 'toggle'; key: string; label: string }
  | { kind: 'date'; key: string; label: string; hint?: string }
  /** 글자 목록 (문단, 표의 칸 등) */
  | { kind: 'strings'; key: string; label: string; hint?: string; max: number; itemMax?: number; addLabel?: string; multiline?: boolean; keepEmpty?: boolean }
  /** 같은 모양의 항목 목록 */
  | { kind: 'list'; key: string; label: string; hint?: string; max: number; item: FieldDef[]; addLabel: string; itemTitleKey?: string }
  /** 종류에 따라 모양이 달라지는 항목 목록 (페이지 내용 블록) */
  | { kind: 'variants'; key: string; label: string; hint?: string; max: number; variants: Record<string, { label: string; fields: FieldDef[] }>; addLabel: string };

export const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: 'truck', label: '배송' },
  { value: 'languages', label: '언어' },
  { value: 'scan', label: '스캔' },
  { value: 'wrench', label: '설치' },
  { value: 'wifi', label: '와이파이' },
  { value: 'tv', label: 'TV' },
  { value: 'globe', label: '지구본' },
  { value: 'sim', label: '유심' },
  { value: 'phone', label: '스마트폰' },
  { value: 'shield', label: '방패' },
  { value: 'headset', label: '상담' },
  { value: 'wallet', label: '지갑' },
  { value: 'badge', label: '인증' },
  { value: 'handshake', label: '악수' },
  { value: 'clock', label: '시계' },
];

const NETWORK_OPTIONS = ['SKT', 'KT', 'LGU+'].map((v) => ({ value: v, label: v }));

// ---------------------------------------------------------------------------
// 서브 페이지 본문 블록 (페이지마다 원하는 블록을 원하는 순서로 쌓는다)
// ---------------------------------------------------------------------------
export const BLOCK_VARIANTS: Extract<FieldDef, { kind: 'variants' }>['variants'] = {
  notice: {
    label: '안내 상자 (노란 상자)',
    fields: [{ kind: 'text', key: 'text', label: '안내 문구', max: 400, multiline: true, required: true }],
  },
  text: {
    label: '글',
    fields: [
      { kind: 'text', key: 'heading', label: '소제목 (선택)', max: 60 },
      { kind: 'strings', key: 'paragraphs', label: '문단', max: 12, itemMax: 1500, multiline: true, addLabel: '문단 추가' },
    ],
  },
  cards: {
    label: '카드 목록 (아이콘 + 제목 + 설명)',
    fields: [
      {
        kind: 'list',
        key: 'items',
        label: '카드',
        max: 8,
        addLabel: '카드 추가',
        itemTitleKey: 'title',
        item: [
          { kind: 'select', key: 'icon', label: '아이콘', options: ICON_OPTIONS },
          { kind: 'text', key: 'title', label: '제목', max: 60, required: true },
          { kind: 'text', key: 'desc', label: '설명', max: 300, multiline: true },
        ],
      },
    ],
  },
  steps: {
    label: '단계 안내 (1, 2, 3 …)',
    fields: [
      { kind: 'text', key: 'heading', label: '소제목 (선택)', max: 60 },
      {
        kind: 'list',
        key: 'items',
        label: '단계',
        max: 8,
        addLabel: '단계 추가',
        itemTitleKey: 'title',
        item: [
          { kind: 'text', key: 'title', label: '제목', max: 60, required: true },
          { kind: 'text', key: 'desc', label: '설명', max: 300, multiline: true },
        ],
      },
    ],
  },
  table: {
    label: '표',
    fields: [
      { kind: 'text', key: 'heading', label: '소제목 (선택)', max: 60 },
      { kind: 'strings', key: 'head', label: '맨 윗줄 제목 칸 (비우면 제목줄 없이 표시)', max: 6, itemMax: 60, keepEmpty: true, addLabel: '제목 칸 추가' },
      {
        kind: 'list',
        key: 'rows',
        label: '줄',
        max: 30,
        addLabel: '줄 추가',
        item: [{ kind: 'strings', key: 'cells', label: '칸 (제목줄 칸 수와 맞춰 주세요)', max: 6, itemMax: 300, keepEmpty: true, addLabel: '칸 추가' }],
      },
    ],
  },
  faq: {
    label: '질문과 답변 (펼침)',
    fields: [
      {
        kind: 'list',
        key: 'items',
        label: '질문',
        max: 20,
        addLabel: '질문 추가',
        itemTitleKey: 'q',
        item: [
          { kind: 'text', key: 'q', label: '질문', max: 200, required: true },
          { kind: 'text', key: 'a', label: '답변', max: 2000, multiline: true, required: true },
        ],
      },
    ],
  },
  links: {
    label: '링크 목록',
    fields: [
      { kind: 'text', key: 'heading', label: '소제목 (선택)', max: 60 },
      {
        kind: 'list',
        key: 'items',
        label: '링크',
        max: 12,
        addLabel: '링크 추가',
        itemTitleKey: 'label',
        item: [
          { kind: 'text', key: 'label', label: '이름', max: 60, required: true },
          { kind: 'link', key: 'href', label: '링크', hint: '바깥 주소는 https://... 로 입력합니다.' },
        ],
      },
    ],
  },
  cta: {
    label: '안내 배너 (어두운 상자 + 버튼)',
    fields: [
      { kind: 'text', key: 'title', label: '제목', max: 80, required: true },
      { kind: 'text', key: 'desc', label: '설명', max: 200 },
      { kind: 'text', key: 'label', label: '버튼 글자', max: 30, required: true },
      { kind: 'link', key: 'href', label: '버튼 링크' },
    ],
  },
};

export const PAGE_BLOCKS_FIELD: Extract<FieldDef, { kind: 'variants' }> = {
  kind: 'variants',
  key: 'blocks',
  label: '페이지 본문',
  hint: '아래에서 원하는 블록을 골라 추가하고, ▲▼ 로 순서를 바꿉니다.',
  max: 30,
  addLabel: '블록 추가',
  variants: BLOCK_VARIANTS,
};

// ---------------------------------------------------------------------------
// 목록형 항목: 요금제 · 이벤트 · 공지 · 자주 묻는 질문
// ---------------------------------------------------------------------------
export interface ResourceUi {
  /** 관리자 화면 제목 */
  title: string;
  /** 목록에서 한 줄 제목으로 쓸 컬럼 */
  titleKey: string;
  /** 목록 아래 설명 컬럼 (여러 개면 · 로 이어서 보여준다) */
  subKeys: string[];
  fields: FieldDef[];
  /** 새 항목의 기본값 */
  empty: Record<string, unknown>;
  /** 기본 내용 가져오기 안내 문구 */
  seedHelp: string;
  /** 이 항목에는 순서 이동(▲▼) 대신 게시일 순서를 쓴다 */
  byDate?: boolean;
  /** 사이트에 보이는 곳 안내 */
  help: string;
}

export const PLAN_UI: ResourceUi = {
  title: '요금제 관리',
  titleKey: 'name',
  subKeys: ['network', 'data_label', 'promo_price'],
  help: '요금제 목록, 요금제 상세, 가입접수, 홈의 추천 요금제에 보입니다. 배지가 있는 요금제가 홈 추천에 먼저 나옵니다.',
  seedHelp: '아직 등록한 요금제가 없어 예시 요금제가 표시되고 있습니다(예시 안내 문구 포함). 가져와서 실제 요금제로 고치면 예시 안내 문구가 사라집니다.',
  empty: { name: '', network: 'KT', data_label: '', data_gb: 0, voice: '', sms: '', price: 0, promo_price: 0, promo_note: '', features: [], badge: '', sort_order: 0, active: true },
  fields: [
    { kind: 'text', key: 'name', label: '요금제 이름', max: 60, required: true, placeholder: '통화 넉넉 7GB' },
    { kind: 'select', key: 'network', label: '통신망', options: NETWORK_OPTIONS },
    { kind: 'text', key: 'data_label', label: '데이터 표시 문구', max: 30, placeholder: '7GB + 1Mbps' },
    { kind: 'number', key: 'data_gb', label: '데이터량(GB, 정렬·필터용)', min: 0, max: 999, hint: '무제한은 999' },
    { kind: 'text', key: 'voice', label: '음성통화', max: 30, placeholder: '300분 / 기본제공' },
    { kind: 'text', key: 'sms', label: '문자', max: 30, placeholder: '100건 / 기본제공' },
    { kind: 'number', key: 'price', label: '정상 요금(원)', min: 0, max: 10000000 },
    { kind: 'number', key: 'promo_price', label: '할인 요금(원)', min: 0, max: 10000000, hint: '비우면 정상 요금과 같게 표시됩니다.' },
    { kind: 'text', key: 'promo_note', label: '할인 조건 문구', max: 80, placeholder: '할인 종료 후 29,700원' },
    { kind: 'strings', key: 'features', label: '부가 혜택', max: 6, itemMax: 30, addLabel: '혜택 추가', hint: '예: 무료 국제통화 패키지 (「무료 국제통화 포함」 필터는 이 이름으로 찾습니다)' },
    { kind: 'text', key: 'badge', label: '배지', max: 12, placeholder: '인기' },
    { kind: 'number', key: 'sort_order', label: '순서 번호', hint: '작을수록 먼저 보입니다.' },
    { kind: 'toggle', key: 'active', label: '사이트에 노출' },
  ],
};

const POST_FIELDS = (periodHint: string): FieldDef[] => [
  { kind: 'text', key: 'title', label: '제목', max: 120, required: true },
  { kind: 'date', key: 'published_at', label: '게시일', hint: '목록에서 최신 게시일이 위에 보입니다.' },
  { kind: 'text', key: 'period', label: '기간', max: 40, hint: periodHint },
  { kind: 'text', key: 'body', label: '내용', max: 5000, multiline: true, hint: '줄을 바꾸면 문단이 나뉩니다.' },
  { kind: 'toggle', key: 'active', label: '사이트에 노출' },
];

export const EVENT_UI: ResourceUi = {
  title: '이벤트 관리',
  titleKey: 'title',
  subKeys: ['published_at', 'period'],
  byDate: true,
  help: '이벤트 목록과 이벤트 상세, 홈의 최신 소식에 보입니다.',
  seedHelp: '아직 등록한 이벤트가 없어 기본 이벤트가 표시되고 있습니다. 가져오면 수정할 수 있습니다.',
  empty: { title: '', published_at: '', period: '상시', body: '', sort_order: 0, active: true },
  fields: POST_FIELDS('예: 상시 / 2026.11.01 ~ 2026.11.30'),
};

export const NOTICE_UI: ResourceUi = {
  title: '공지 관리',
  titleKey: 'title',
  subKeys: ['published_at'],
  byDate: true,
  help: '공지사항 목록과 공지 상세, 홈의 공지사항·최신 소식에 보입니다.',
  seedHelp: '아직 등록한 공지가 없어 기본 공지가 표시되고 있습니다. 가져오면 수정할 수 있습니다.',
  empty: { title: '', published_at: '', period: '', body: '', sort_order: 0, active: true },
  fields: POST_FIELDS('필요할 때만 입력'),
};

export const FAQ_CATEGORY_OPTIONS = ['가입/개통', '요금제', '단말/유심', 'eSIM', '기타'].map((v) => ({ value: v, label: v }));

export const FAQ_UI: ResourceUi = {
  title: '자주 묻는 질문 관리',
  titleKey: 'q',
  subKeys: ['category'],
  help: '고객센터의 자주 묻는 질문과 홈의 질문 목록에 보입니다.',
  seedHelp: '아직 등록한 질문이 없어 기본 질문이 표시되고 있습니다. 가져오면 수정할 수 있습니다.',
  empty: { category: '가입/개통', q: '', a: '', sort_order: 0, active: true },
  fields: [
    { kind: 'select', key: 'category', label: '분류', options: FAQ_CATEGORY_OPTIONS },
    { kind: 'text', key: 'q', label: '질문', max: 200, required: true },
    { kind: 'text', key: 'a', label: '답변', max: 3000, multiline: true, required: true },
    { kind: 'number', key: 'sort_order', label: '순서 번호', hint: '작을수록 먼저 보입니다.' },
    { kind: 'toggle', key: 'active', label: '사이트에 노출' },
  ],
};
