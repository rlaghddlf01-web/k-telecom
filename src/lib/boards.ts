export interface Post {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** 이벤트는 기간 표기용 */
  period?: string;
  body: string[];
}

export const NOTICES: Post[] = [
  {
    id: 'open',
    title: 'K-Telecom 홈페이지 오픈 안내',
    date: '2026-11-06',
    body: [
      'K-Telecom 홈페이지가 열렸습니다.',
      '스마트폰 단말 할부, 알뜰폰 요금제, 원룸 인터넷·IPTV 상품을 안내하고 있으며, 제휴 신청과 상담문의를 받고 있습니다.',
      '온라인 가입접수와 조회 기능은 준비 중이며, 준비되는 대로 공지드리겠습니다.',
    ],
  },
];

export const EVENTS: Post[] = [
  {
    id: 'galaxy-zero',
    title: '갤럭시 A시리즈 0원폰 안내',
    date: '2026-11-06',
    period: '상시',
    body: [
      '삼성 갤럭시 A시리즈 미개봉 신제품을 기기값 0원으로 만나보세요.',
      '외국인등록증 기반으로 24개월 통신요금에 합산 청구되며 초기비용은 0원입니다.',
      '할부 가능 여부는 심사 결과에 따라 달라질 수 있습니다.',
    ],
  },
  {
    id: 'room-internet',
    title: '원룸·기숙사 인터넷 결합 사은품 안내',
    date: '2026-11-06',
    period: '상시',
    body: [
      '100M / 500M GiGA 인터넷과 Wi-Fi, 실시간 IPTV를 결합해 가입하면 현금 사은품을 지원합니다.',
      '전문 기사님이 방문해 무료로 개통하고 세팅합니다.',
    ],
  },
];

export const WINNERS: Post[] = [];
