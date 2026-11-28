import { COMPANY } from '@/lib/site';
import { FREET_SELF_URL } from '@/lib/freet';

export type IconName =
  | 'truck' | 'languages' | 'scan' | 'wrench' | 'wifi' | 'tv' | 'globe' | 'sim'
  | 'phone' | 'shield' | 'headset' | 'wallet' | 'badge' | 'handshake' | 'clock';

export type Block =
  | { type: 'notice'; text: string }
  | { type: 'text'; heading?: string; paragraphs: string[] }
  | { type: 'cards'; items: { icon: IconName; title: string; desc: string }[] }
  | { type: 'steps'; heading?: string; items: { title: string; desc: string }[] }
  | { type: 'table'; heading?: string; head?: string[]; rows: string[][] }
  | { type: 'faq'; items: { q: string; a: string }[] }
  | { type: 'links'; heading?: string; items: { label: string; href: string }[] }
  | { type: 'cta'; title: string; desc: string; label: string; href: string };

export interface PageDef {
  path: string;
  title: string;
  lead?: string;
  blocks: Block[];
}

const ONLINE_SOON =
  '온라인 접수 기능은 준비 중입니다. 현재는 1:1 상담문의로 신청해 주시면 담당자가 연락드립니다.';

const INQUIRY_CTA: Block = {
  type: 'cta',
  title: '상담이 필요하신가요?',
  desc: '남겨주신 연락처로 담당자가 안내해 드립니다.',
  label: '1:1 상담문의',
  href: '/support/inquiry',
};

export const PAGES: PageDef[] = [
  {
    path: '/plans/self',
    title: '셀프개통',
    lead: '프리티 가입 화면에서 직접 가입하는 방법입니다. 가입 화면은 한국어라서 아래 순서와 용어표를 보면서 따라 하세요.',
    blocks: [
      { type: 'notice', text: '가입은 프리티 화면(한국어)에서 진행합니다. 본인인증에 한국 휴대폰 번호, 한국 신용카드, 공동인증서 중 하나가 필요합니다. 한국 휴대폰이 없다면 아래 상담 문의로 먼저 문의해 주세요.' },
      { type: 'notice', text: '크롬(Chrome)에서 가입 화면을 열고 마우스 오른쪽 버튼을 눌러 번역을 선택하면 내 나라 말로 볼 수 있습니다.' },
      {
        type: 'table',
        heading: '가입 전에 준비하세요',
        head: ['준비물', '내용'],
        rows: [
          ['신분증', '외국인은 외국인등록증, 내국인은 주민등록증 또는 운전면허증'],
          ['본인인증 수단', '토스 또는 네이버 간편인증, 본인 명의 신용카드, 공동인증서 중 하나. 토스 인증서를 만들려면 한국 휴대폰, 한국 은행 계좌, 외국인등록증 실물이 필요합니다.'],
          ['한국 휴대폰', '본인인증에 사용합니다. 한국 휴대폰 번호가 없으면 셀프개통이 어렵습니다.'],
          ['유심 또는 eSIM', '이미 사용한 유심으로는 개통할 수 없습니다.'],
        ],
      },
      {
        type: 'steps',
        heading: '가입 순서',
        items: [
          { title: '가입조건 선택', desc: '"일반", "미성년자", "외국인" 중 나에게 맞는 것을 고르고 "다음"을 누릅니다. 외국인은 만 19세 이상부터 온라인 개통이 가능합니다.' },
          { title: '가입 제한 확인', desc: 'M-safer 안내 창이 나오면 내 명의로 가입 제한이 걸려 있지 않은지 확인하고 "확인"을 누릅니다.' },
          { title: '준비물 확인', desc: '외국인등록증과 본인인증 수단을 준비했는지 확인하고 "다음"을 누릅니다.' },
          { title: '가입유형 선택', desc: '"번호이동"(쓰던 번호 그대로, 기존 통신사에 가입한 지 3개월이 지나야 합니다) 또는 "신규가입"(새 번호)을 고르고 "다음"을 누릅니다.' },
          { title: '요금제 선택', desc: '원하는 요금제를 고르고 "다음"을 누릅니다. 요금은 이 사이트의 요금제 목록에서 미리 볼 수 있습니다.' },
          { title: '약관동의, 본인확인, 가입정보 입력, 결제', desc: '화면의 안내에 따라 약관에 동의하고, 본인인증과 가입 정보 입력, 결제를 하면 개통이 완료됩니다.' },
        ],
      },
      {
        type: 'table',
        heading: '가입 화면 용어표 (한국어 화면에 보이는 말)',
        head: ['화면의 말', '뜻'],
        rows: [
          ['@@다음', '다음 단계로 이동합니다.'],
          ['@@확인', '안내를 확인했습니다.'],
          ['@@일반', '만 19세 이상 내국인'],
          ['@@미성년자', '만 19세 미만 (법정대리인 연락처가 필요합니다)'],
          ['@@외국인', '만 19세 이상 외국인'],
          ['@@번호이동', '쓰던 번호를 그대로 쓰고 통신사만 옮깁니다.'],
          ['@@신규가입', '새 전화번호를 만듭니다.'],
          ['@@요금제 선택', '쓸 요금제를 고릅니다.'],
          ['@@낮은 가격 순 / 추천순 / 높은 가격 순', '요금제를 나열하는 순서'],
          ['@@더보기', '요금제를 더 봅니다.'],
          ['@@약관동의', '이용 약관에 동의합니다.'],
          ['@@본인확인', '신분증과 본인인증으로 본인임을 확인합니다.'],
          ['@@가입정보 입력', '이름, 주소 같은 가입 정보를 입력합니다.'],
          ['@@결제', '요금 결제 수단을 등록합니다.'],
          ['@@개통완료', '가입이 끝났습니다.'],
        ],
      },
      {
        type: 'text',
        heading: '개통이 안 될 수 있는 경우',
        paragraphs: [
          '3G 단말기나 HD Voice를 지원하지 않는 단말기로는 가입할 수 없습니다.',
          '통신사별로 최대 3개 회선까지만 개통할 수 있고, 최근 180일 안에 모든 통신사를 합쳐 3회선을 넘게 개통할 수 없습니다.',
          '유심 재고나 점검 때문에 일시적으로 가입이 제한될 수 있습니다. 화면의 안내를 확인해 주세요.',
        ],
      },
      {
        type: 'cta',
        title: '본인인증용 인증서가 없나요?',
        desc: '토스 인증서를 앱 화면 그대로 따라 하면서 만들 수 있습니다. 한국 휴대폰, 한국 은행 계좌, 외국인등록증 실물이 필요합니다.',
        label: '토스 인증서 만들기',
        href: '/guide/toss',
      },
      { type: 'links', heading: '다른 인증서 만들기', items: [{ label: '카카오톡 인증서 만들기', href: '/guide/kakao' }, { label: 'PASS 인증서 만들기', href: '/guide/pass' }] },
      { type: 'links', heading: '가입하러 가기', items: [{ label: '프리티 셀프개통 시작하기 (한국어 화면)', href: FREET_SELF_URL }] },
      INQUIRY_CTA,
    ],
  },
  {
    path: '/plans/info',
    title: '요금제 이용 안내',
    lead: '가입 전에 꼭 확인해 주세요. 요금제마다 조건이 다를 수 있습니다.',
    blocks: [
      { type: 'notice', text: '아래 내용은 프리티텔레콤 개통 정책(2026년 11월) 기준이며, 정책에 따라 바뀔 수 있습니다. 선택하신 요금제의 정확한 조건은 가입 상담 때 안내해 드립니다.' },
      {
        type: 'table',
        heading: '후불 가입 조건',
        head: ['구분', '내용'],
        rows: [
          ['청구서', '후불 요금제는 문자(MMS) 또는 이메일 청구서로만 신청할 수 있습니다.'],
          ['결제 제한', '소액결제와 인앱결제는 차단된 상태로 개통됩니다.'],
          ['개통 가능 요금제', '요금제 목록에 있는 요금제만 개통할 수 있습니다.'],
        ],
      },
      {
        type: 'table',
        heading: '요금제 변경',
        head: ['구분', '내용'],
        rows: [
          ['변경 시기', '요금제마다 변경할 수 있는 시기가 다릅니다. 가입 후 93일이 지나야 변경할 수 있는 요금제도 있고, 185일 이내에는 변경할 수 없는 요금제도 있습니다.'],
          ['변경 방향', '일반 요금제에서 고객중심(제휴) 요금제로는 변경할 수 없습니다.'],
          ['속도 보장 요금제', '1Mbps 이상 속도가 보장되는 요금제에서 속도 보장이 없는 요금제로는 변경이 제한될 수 있습니다.'],
        ],
      },
      {
        type: 'table',
        heading: '선불 요금제 이용 안내',
        head: ['구분', '내용'],
        rows: [
          ['이용 방식', '기본료를 먼저 충전해서 쓰는 방식입니다. 충전한 금액은 환불되지 않습니다.'],
          ['수신 가능 기간', '충전 후 수신 가능한 기간이 있습니다. SKT 10일, KT 15일, LG U+ 15일 안에 다시 충전하지 않으면 번호가 해지될 수 있습니다.'],
          ['개통 가능 시간', '토요일, 일요일, 공휴일에도 개통할 수 있습니다. 일요일에는 신규 가입만 가능하고 번호이동은 할 수 없습니다.'],
          ['무료충전 상품', '"2회충전", "3회충전" 상품은 개통 후 2개월 또는 3개월 동안 기본료를 무료로 충전해 드리는 상품입니다.'],
        ],
      },
      {
        type: 'table',
        heading: '추가 데이터 프로모션',
        head: ['구분', '내용'],
        rows: [
          ['표시', '"추가 데이터 +5GB (프로모션)"처럼 표시된 요금제는 프로모션으로 데이터를 더 받을 수 있습니다.'],
          ['적용 방법', 'SKT 요금제는 별도 신청이 필요하고, KT 요금제는 가입하면 자동으로 적용됩니다.'],
          ['기간', '신청 기간과 지급 기간은 프로모션마다 다릅니다. 가입 상담 때 확인해 드립니다.'],
        ],
      },
      INQUIRY_CTA,
    ],
  },
  {
    path: '/plans/addons',
    title: '부가서비스',
    lead: '요금제와 함께 이용할 수 있는 서비스입니다.',
    blocks: [
      {
        type: 'table',
        head: ['서비스', '내용'],
        rows: [
          ['무료 국제통화 패키지', '베트남, 중국, 우즈벡 등으로 매월 무료 통화'],
          ['eSIM 즉시 개통', 'eSIM으로 1분 안에 개통'],
          ['실물 유심 무료 배송', '실물 유심은 무료로 배송'],
        ],
      },
      { type: 'text', paragraphs: ['그 밖의 부가서비스는 확정되는 대로 이곳에 안내합니다.'] },
    ],
  },
  {
    path: '/phones/installment',
    title: '단말 할부 안내',
    lead: '신용카드 할부가 어려운 외국인 고객도 외국인등록증으로 단말을 구매할 수 있습니다.',
    blocks: [
      { type: 'notice', text: '휴대폰 판매는 현재 준비 중입니다. 아래 안내는 참고용이며, 판매가 시작될 때 달라질 수 있습니다.' },
      {
        type: 'table',
        head: ['구분', '내용'],
        rows: [
          ['대상', '외국인등록증(ARC)을 가진 분'],
          ['초기비용', '0원'],
          ['할부 기간', '24개월'],
          ['청구 방법', '매월 통신요금 고지서에 합산 청구'],
          ['취급 단말', '삼성 갤럭시 A시리즈 미개봉 신제품, 아이폰 12/13/14 S급 리퍼비시'],
        ],
      },
      {
        type: 'cards',
        items: [
          { icon: 'wallet', title: '현금 일시불 부담 없이', desc: '100만원 이상 현금을 한 번에 내지 않아도 됩니다.' },
          { icon: 'badge', title: '정품 검수', desc: '리퍼비시 단말은 정품 검수를 마친 제품입니다.' },
        ],
      },
      { type: 'text', paragraphs: ['할부 가능 여부는 신분증 확인과 심사 결과에 따라 달라질 수 있습니다.'] },
      INQUIRY_CTA,
    ],
  },
  {
    path: '/internet',
    title: '원룸 인터넷',
    lead: '이사하는 날 인터넷이 바로 되도록, 원룸·기숙사 전용 상품을 1분 만에 신청하세요.',
    blocks: [
      {
        type: 'cards',
        items: [
          { icon: 'wifi', title: 'GiGA 인터넷 + Wi-Fi', desc: '100M / 500M 상품과 Wi-Fi를 함께 제공합니다.' },
          { icon: 'wrench', title: '전문 기사 방문 설치', desc: '기사님이 방문해 무료로 개통하고 세팅합니다.' },
          { icon: 'wallet', title: '현금 사은품', desc: '가입 시 현금 사은품을 지원합니다.' },
          { icon: 'languages', title: '모국어 신청', desc: '언어 걱정 없이 내 나라 말로 신청합니다.' },
        ],
      },
      {
        type: 'steps',
        heading: '신청 순서',
        items: [
          { title: '상품 선택', desc: '원룸·기숙사에 맞는 상품을 고릅니다.' },
          { title: '1분 신청', desc: '신청서를 간단히 작성합니다.' },
          { title: '방문 설치', desc: '약속한 날 기사님이 방문해 설치합니다.' },
        ],
      },
      INQUIRY_CTA,
    ],
  },
  {
    path: '/internet/iptv',
    title: 'IPTV 결합',
    lead: '인터넷과 함께 실시간 IPTV까지 한 번에 가입하세요.',
    blocks: [
      {
        type: 'cards',
        items: [
          { icon: 'tv', title: '실시간 IPTV', desc: '인터넷과 결합해 실시간 방송을 즐깁니다.' },
          { icon: 'badge', title: '결합 혜택', desc: '인터넷과 TV를 함께 가입하면 결합 혜택이 있습니다.' },
        ],
      },
      INQUIRY_CTA,
    ],
  },
  {
    path: '/partnership/guide',
    title: '제휴 안내',
    lead: '외국인 대상 통신 상품을 함께 공급할 파트너사를 모십니다.',
    blocks: [
      {
        type: 'cards',
        items: [
          { icon: 'handshake', title: '마케팅비 0원 유치', desc: '세무 환급과 중고거래 서비스의 트래픽으로 신규 가입자를 연결합니다.' },
          { icon: 'languages', title: '외국어 CS 부담 감소', desc: '모국어 UI와 신분증 사전 OCR로 외국어 상담 부담을 줄입니다.' },
          { icon: 'wallet', title: '회선당 매출 극대화', desc: '단말 할부, 요금제, 인터넷·TV 결합으로 장기 유지를 돕습니다.' },
        ],
      },
      {
        type: 'steps',
        heading: '제휴 진행 순서',
        items: [
          { title: '제휴 신청', desc: '신청서를 접수합니다.' },
          { title: '협약 체결', desc: '위탁판매 협약을 맺고 판매점 코드를 발급받습니다.' },
          { title: '연동', desc: '가입 신청 연동 API 규격에 맞춰 연동합니다.' },
          { title: '정산', desc: '유치 건당 정산 단가(리베이트 정책)를 협의합니다.' },
        ],
      },
      {
        type: 'cta',
        title: '제휴를 신청하세요',
        desc: '신청서를 남기시면 담당자가 연락드립니다.',
        label: '제휴 신청',
        href: '/partnership',
      },
    ],
  },
  {
    path: '/support/forms',
    title: '각종 신청서식',
    lead: '신청서식이 준비되는 대로 이곳에서 내려받으실 수 있습니다.',
    blocks: [
      { type: 'notice', text: '현재 등록된 서식이 없습니다. 필요하신 서식은 1:1 상담문의로 요청해 주세요.' },
      INQUIRY_CTA,
    ],
  },
  {
    path: '/support/guide',
    title: '이용자 피해예방 가이드',
    lead: '통신 서비스 이용 중 피해를 막기 위한 기본 수칙입니다.',
    blocks: [
      {
        type: 'cards',
        items: [
          { icon: 'shield', title: '개인정보를 함부로 알려주지 마세요', desc: '외국인등록증 사진과 번호는 공식 접수 경로 외에는 보내지 않습니다.' },
          { icon: 'badge', title: '출처가 불분명한 링크는 열지 마세요', desc: '문자나 메신저로 온 링크를 눌러 정보를 입력하지 않습니다.' },
          { icon: 'wallet', title: '현금 선입금을 요구하면 의심하세요', desc: '공식 안내에 없는 계좌 이체 요구는 거절합니다.' },
        ],
      },
      {
        type: 'links',
        heading: '도움받을 수 있는 곳',
        items: [
          { label: '명의도용방지 서비스', href: 'https://msafer.or.kr/index.do' },
          { label: '불법스팸대응센터', href: 'https://spam.kisa.or.kr/spam/main.do' },
          { label: '통신 미환급액 조회', href: 'https://www.smartchoice.or.kr/smc/service/refund.do' },
        ],
      },
    ],
  },
  {
    path: '/order-status',
    title: '신청/배송조회',
    lead: '신청 내용과 배송 현황을 확인하는 곳입니다.',
    blocks: [
      { type: 'notice', text: '조회 기능은 준비 중입니다. 신청 상태가 궁금하시면 1:1 상담문의를 이용해 주세요.' },
      INQUIRY_CTA,
    ],
  },
  {
    path: '/company',
    title: '회사소개',
    lead: '외국인 고객의 생활을 편하게 만드는 서비스를 만듭니다.',
    blocks: [
      {
        type: 'text',
        paragraphs: [
          'K-Telecom은 국내에 체류하는 외국인 근로자와 유학생을 위해 세무 환급, 중고거래, 주거 생활, 통신을 한곳에서 제공하는 서비스를 운영합니다.',
        ],
      },
      {
        type: 'table',
        rows: [
          ['회사명', COMPANY.name],
          ['대표', COMPANY.ceo],
          ['주소', COMPANY.address],
          ['전화', COMPANY.phone],
          ['이메일', COMPANY.email],
        ],
      },
    ],
  },
  {
    path: '/location',
    title: '찾아오시는 길',
    blocks: [
      {
        type: 'table',
        rows: [
          ['주소', COMPANY.address],
          ['전화', COMPANY.phone],
        ],
      },
      {
        type: 'links',
        items: [{ label: '네이버 지도에서 보기', href: `https://map.naver.com/p/search/${encodeURIComponent(COMPANY.address)}` }],
      },
    ],
  },
  {
    path: '/terms',
    title: '이용약관',
    blocks: [
      { type: 'notice', text: '이 약관은 초안입니다. 서비스 오픈 전에 법무 검토를 거쳐 확정해야 합니다.' },
      {
        type: 'text',
        heading: '제1조 (목적)',
        paragraphs: ['이 약관은 K-Telecom(이하 "회사")이 제공하는 통신 상품 안내 및 제휴 접수 서비스의 이용 조건과 절차, 회사와 이용자의 권리와 의무를 정하는 것을 목적으로 합니다.'],
      },
      {
        type: 'text',
        heading: '제2조 (서비스의 내용)',
        paragraphs: ['회사는 스마트폰, 알뜰폰 요금제, 인터넷·IPTV 상품에 대한 안내와 상담, 제휴 신청 접수 서비스를 제공합니다.'],
      },
      {
        type: 'text',
        heading: '제3조 (이용자의 의무)',
        paragraphs: ['이용자는 정확한 정보를 입력해야 하며, 타인의 정보를 도용해서는 안 됩니다.'],
      },
    ],
  },
  {
    path: '/privacy',
    title: '개인정보 처리방침',
    blocks: [
      { type: 'notice', text: '이 방침은 초안입니다. 서비스 오픈 전에 법무 검토를 거쳐 확정해야 합니다.' },
      {
        type: 'text',
        heading: '1. 수집하는 개인정보',
        paragraphs: ['제휴 신청: 회사명, 담당자 이름, 직책, 연락처, 이메일, 제안 내용', '1:1 상담문의: 이름, 연락처, 이메일(선택), 문의 내용'],
      },
      {
        type: 'text',
        heading: '2. 수집 목적',
        paragraphs: ['제휴 및 상담 요청에 대한 확인과 회신'],
      },
      {
        type: 'text',
        heading: '3. 보유 기간',
        paragraphs: ['처리 목적이 끝나면 지체 없이 파기합니다. 구체적인 보유 기간은 확정 후 안내합니다.'],
      },
      {
        type: 'text',
        heading: '4. 문의처',
        paragraphs: [`${COMPANY.name} · ${COMPANY.phone} · ${COMPANY.email}`],
      },
    ],
  },
];

export function findPage(path: string): PageDef | undefined {
  return PAGES.find((p) => p.path === path);
}
