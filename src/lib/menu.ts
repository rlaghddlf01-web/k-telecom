export interface MenuLink {
  label: string;
  href: string;
}

export interface MenuItem extends MenuLink {
  children: MenuLink[];
}

export const MENU: MenuItem[] = [
  {
    label: '요금제',
    href: '/plans',
    children: [
      { label: '요금제 안내', href: '/plans' },
      { label: '가입접수', href: '/plans/apply' },
      { label: '셀프개통', href: '/plans/self' },
      { label: '부가서비스', href: '/plans/addons' },
      { label: 'eSIM 안내', href: '/plans/esim' },
    ],
  },
  {
    label: '스마트폰',
    href: '/phones',
    children: [
      { label: '단말 목록', href: '/phones' },
      { label: '단말 할부 안내', href: '/phones/installment' },
    ],
  },
  {
    label: '인터넷·IPTV',
    href: '/internet',
    children: [
      { label: '원룸 인터넷', href: '/internet' },
      { label: 'IPTV 결합', href: '/internet/iptv' },
    ],
  },
  {
    label: '이벤트',
    href: '/events',
    children: [{ label: '이벤트', href: '/events' }],
  },
  {
    label: '제휴',
    href: '/partnership',
    children: [
      { label: '제휴 안내', href: '/partnership/guide' },
      { label: '제휴 신청', href: '/partnership' },
    ],
  },
  {
    label: '고객센터',
    href: '/support/notice',
    children: [
      { label: '공지사항', href: '/support/notice' },
      { label: '자주 묻는 질문', href: '/support/faq' },
      { label: '각종 신청서식', href: '/support/forms' },
      { label: '1:1 상담문의', href: '/support/inquiry' },
      { label: '이용자 피해예방 가이드', href: '/support/guide' },
    ],
  },
];

/** 헤더 최상단 유틸 줄 */
export const UTILITY_LINKS: MenuLink[] = [
  { label: '셀프개통', href: '/plans/self' },
  { label: 'eSIM', href: '/plans/esim' },
  { label: '신청/배송조회', href: '/order-status' },
];

export const FOOTER_LINKS: MenuLink[] = [
  { label: '회사소개', href: '/company' },
  { label: '이용약관', href: '/terms' },
  { label: '개인정보 처리방침', href: '/privacy' },
  { label: '찾아오시는 길', href: '/location' },
];

/** 이용자 보호를 위한 공공 서비스 링크 */
export const PUBLIC_LINKS: (MenuLink & { external: true })[] = [
  { label: '통신 미환급액 조회', href: 'https://www.smartchoice.or.kr/smc/service/refund.do', external: true },
  { label: '불법스팸대응센터', href: 'https://spam.kisa.or.kr/spam/main.do', external: true },
  { label: '명의도용방지 서비스', href: 'https://msafer.or.kr/index.do', external: true },
];

/** 현재 경로가 속한 메인 메뉴 */
export function findSection<T extends MenuLink & { children: MenuLink[] }>(path: string, menu: T[] = MENU as unknown as T[]): T | undefined {
  return menu.find((m) => m.children.some((c) => c.href === path) || m.href === path);
}
