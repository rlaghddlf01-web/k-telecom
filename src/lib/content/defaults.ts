// 관리자에서 아직 아무것도 등록하지 않았을 때 보여주는 기본 내용 (지금 사이트에 있는 내용 그대로).
// 관리자 화면의 [기본 내용 가져오기] 버튼으로 이 내용을 DB에 복사한 뒤 수정할 수 있다.
import { MENU, UTILITY_LINKS, FOOTER_LINKS, PUBLIC_LINKS } from '@/lib/menu';
import { COMPANY } from '@/lib/site';
import type { Banner, BannerPosition, SiteSettings, ThemeKey } from '@/lib/content/types';

function banner(
  position: BannerPosition,
  order: number,
  theme: ThemeKey,
  fields: Partial<Banner> & Pick<Banner, 'title' | 'link_url'>,
): Banner {
  return {
    id: `default-${position}-${order}`,
    position,
    eyebrow: '',
    description: '',
    button_label: '',
    image_url: '',
    theme,
    sort_order: order,
    active: true,
    starts_at: null,
    ends_at: null,
    ...fields,
  };
}

export const DEFAULT_BANNERS: Banner[] = [
  banner('top_strip', 1, 'violet', {
    title: '오픈 기념 · 갤럭시 A시리즈 0원폰과 원룸 인터넷 사은품 이벤트 보기',
    link_url: '/events',
  }),

  banner('hero', 1, 'violet', {
    eyebrow: '외국인 맞춤 통신',
    title: '내 나라 말로\n한 번에 개통',
    description: '스마트폰 · 알뜰폰 · 인터넷 · IPTV를 하나의 앱에서',
    button_label: '상품 보기',
    link_url: '/#products',
  }),
  banner('hero', 2, 'sky', {
    eyebrow: '초기비용 0원',
    title: '기기값 0원\n24개월 분할',
    description: '외국인등록증만 있으면 신용카드 없이 단말 할부 가능',
    button_label: '이용 방법',
    link_url: '/#process',
  }),
  banner('hero', 3, 'rose', {
    eyebrow: '파트너 모집',
    title: '통신 제휴사를\n찾고 있습니다',
    description: '마케팅비 없이 외국인 신규 가입자를 연결해 드립니다',
    button_label: '제휴 신청하기',
    link_url: '/partnership',
  }),

  banner('promo', 1, 'orange', {
    title: '스마트폰 할부',
    description: '외국인등록증 기반 24개월',
    button_label: '자세히 보기',
    link_url: '/phones/installment',
  }),
  banner('promo', 2, 'blue', {
    title: '알뜰폰 요금제',
    description: '월 1~2만원대 실속형',
    button_label: '자세히 보기',
    link_url: '/plans',
  }),
  banner('promo', 3, 'rose', {
    title: '원룸 인터넷+TV',
    description: '1분 신청 · 방문 설치',
    button_label: '자세히 보기',
    link_url: '/internet',
  }),

  banner('showcase', 1, 'navy', {
    eyebrow: '외국인 전용 단말 할부',
    title: '신용카드 없이도\n최신 폰을 내 손에',
    description: '외국인등록증 기반으로 24개월 통신요금과 합산 청구합니다. 초기비용 부담 없이 시작하세요.',
    button_label: '할부 안내 보기',
    link_url: '/phones/installment',
  }),

  banner('popup', 1, 'violet', {
    eyebrow: '오픈 기념 혜택',
    title: '기기값 0원\n24개월 분할',
    description: '외국인등록증만 있으면 신용카드 없이 단말 할부 가능',
    button_label: '자세히 보기',
    link_url: '/events/galaxy-zero',
  }),
];

export const DEFAULT_SETTINGS: SiteSettings = {
  header: {
    logoText: 'K-Telecom',
    menu: MENU.map((m) => ({ label: m.label, href: m.href, children: m.children.map((c) => ({ label: c.label, href: c.href })) })),
    utility: UTILITY_LINKS.map((l) => ({ label: l.label, href: l.href })),
    ctaLabel: '제휴 신청',
    ctaHref: '/partnership',
  },
  footer: {
    description: '국내 체류 외국인을 위한 통신·인터넷 원스톱 서비스',
    company: {
      name: COMPANY.name,
      ceo: COMPANY.ceo,
      address: COMPANY.address,
      phone: COMPANY.phone,
      email: COMPANY.email,
      bizNumber: '',
      salesNumber: '',
    },
    links: FOOTER_LINKS.map((l) => ({ label: l.label, href: l.href })),
    publicLinks: PUBLIC_LINKS.map((l) => ({ label: l.label, href: l.href })),
    copyright: '',
  },
};
