// 관리자에서 수정하는 사이트 내용의 타입 (서버·브라우저 공용, 타입만 있음)

export type ThemeKey = 'violet' | 'sky' | 'rose' | 'orange' | 'blue' | 'navy';

export type BannerPosition = 'top_strip' | 'hero' | 'promo' | 'showcase' | 'popup';

export interface Banner {
  id: string;
  position: BannerPosition;
  /** 제목 (줄바꿈은 \n) */
  title: string;
  /** 제목 위의 작은 문구 */
  eyebrow: string;
  description: string;
  button_label: string;
  link_url: string;
  /** 비어 있으면 테마 색 배경을 사용 */
  image_url: string;
  theme: ThemeKey;
  sort_order: number;
  active: boolean;
  /** 노출 시작·종료 시각 (ISO). 비어 있으면 항상 */
  starts_at: string | null;
  ends_at: string | null;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface MenuEntry extends NavLink {
  children: NavLink[];
}

export interface HeaderSettings {
  logoText: string;
  menu: MenuEntry[];
  utility: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

export interface CompanyInfo {
  name: string;
  ceo: string;
  address: string;
  phone: string;
  email: string;
  /** 사업자등록번호 */
  bizNumber: string;
  /** 통신판매업 신고번호 */
  salesNumber: string;
}

export interface FooterSettings {
  description: string;
  company: CompanyInfo;
  links: NavLink[];
  publicLinks: NavLink[];
  copyright: string;
}

export interface SiteSettings {
  header: HeaderSettings;
  footer: FooterSettings;
}

export type SettingKey = 'header' | 'footer';

export const BANNER_POSITIONS: { id: BannerPosition; label: string; help: string }[] = [
  { id: 'top_strip', label: '상단 띠배너', help: '맨 위 한 줄 안내 문구. 제목과 링크만 사용합니다.' },
  { id: 'hero', label: '메인 슬라이드', help: '홈 첫 화면의 큰 슬라이드. 여러 장을 순서대로 보여줍니다.' },
  { id: 'promo', label: '중간 배너(3칸)', help: '홈 중간의 가로 3칸 배너. 앞의 3개만 보여줍니다.' },
  { id: 'showcase', label: '하단 배너', help: '홈 아래쪽의 큰 가로 배너. 첫 번째 하나만 보여줍니다.' },
  { id: 'popup', label: '팝업', help: '홈에 들어오면 뜨는 팝업. 첫 번째 하나만 보여줍니다.' },
];

export const THEME_OPTIONS: { id: ThemeKey; label: string }[] = [
  { id: 'violet', label: '보라' },
  { id: 'sky', label: '하늘' },
  { id: 'rose', label: '장미' },
  { id: 'orange', label: '주황' },
  { id: 'blue', label: '파랑' },
  { id: 'navy', label: '네이비' },
];
