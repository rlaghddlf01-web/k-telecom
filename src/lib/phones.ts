import type { PhoneKind } from '@/components/PhoneMockup';

export type PhoneGroup = 'galaxy' | 'iphone' | 'budget';

export interface Phone {
  id: string;
  group: PhoneGroup;
  /** 실제 사진을 넣으려면 public/images/phones/ 아래에 파일을 두고 '/images/phones/파일명' 으로 지정 */
  image?: string;
  kind: PhoneKind;
  from: string;
  to: string;
  badge?: string;
  tag: string;
  title: string;
  price: string;
  note: string;
  /** 상세 페이지에 보여줄 설명 (선택) */
  description?: string;
}

/**
 * 휴대폰 데이터: 프리티 공개 홈페이지(freet.co.kr)의 휴대폰 구매 목록 (2026-11-22 기준) 14개.
 * price 는 프리티가 보여 주는 "월 최저가"(24개월 할부 기준)이고, 출고가·색상은 description 에 있습니다.
 * 사진은 프리티 홈페이지의 이미지 주소를 그대로 씁니다. (프리티 이미지 사용 허락과 주소 변경 여부는 확인이 필요합니다)
 * 관리자에서 상품을 등록하면 그쪽이 우선합니다.
 */
export const PHONES: Phone[] = [
  { id: 'fr-phone-113618060', group: 'galaxy', kind: 'back', from: '#38bdf8', to: '#6366f1', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 Z폴드8 울트라 512GB', price: '₩110,834', note: '월 최저가 · 24개월 할부', description: '출고가 ₩2,660,000 · 무약정 · 월 최저가는 ₩110,834이며 24개월 할부 기준입니다. · 색상: 그라파이트 · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/20269258_KZ4_1789463003041.jpg' },
  { id: 'fr-phone-113618016', group: 'galaxy', kind: 'back', from: '#f472b6', to: '#a855f7', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 Z폴드8 512GB', price: '₩102,296', note: '월 최저가 · 24개월 할부', description: '출고가 ₩2,455,100 · 무약정 · 월 최저가는 ₩102,296이며 24개월 할부 기준입니다. · 색상: 그라파이트 · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/20269258_gFF_1789461415436.jpg' },
  { id: 'fr-phone-113613320', group: 'galaxy', kind: 'back', from: '#34d399', to: '#0ea5e9', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 Z플립8 512GB', price: '₩75,788', note: '월 최저가 · 24개월 할부', description: '출고가 ₩1,818,900 · 무약정 · 월 최저가는 ₩75,788이며 24개월 할부 기준입니다. · 색상: 그라파이트, 핑크, 크림 · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/20269258_1NL_1789459569511.jpg' },
  { id: 'fr-phone-113504537', group: 'galaxy', kind: 'punch', from: '#1e293b', to: '#6366f1', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 S26 울트라 512GB', price: '₩85,434', note: '월 최저가 · 24개월 할부', description: '출고가 ₩2,050,400 · 무약정 · 월 최저가는 ₩85,434이며 24개월 할부 기준입니다. · 색상: 블랙 · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/2026370_TkQ_1773215611876.jpg' },
  { id: 'fr-phone-113504453', group: 'galaxy', kind: 'punch', from: '#fb7185', to: '#f59e0b', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 S26+ 512GB', price: '₩71,042', note: '월 최저가 · 24개월 할부', description: '출고가 ₩1,705,000 · 무약정 · 월 최저가는 ₩71,042이며 24개월 할부 기준입니다. · 색상: 블랙, 화이트, 블루 · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/2026370_eAy_1773207501258.jpg' },
  { id: 'fr-phone-113504430', group: 'galaxy', kind: 'punch', from: '#334155', to: '#0f172a', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 S26 512GB', price: '₩62,792', note: '월 최저가 · 24개월 할부', description: '출고가 ₩1,507,000 · 무약정 · 월 최저가는 ₩62,792이며 24개월 할부 기준입니다. · 색상: 블랙, 블루, 화이트 · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/2026370_eAy_1773207501258.jpg' },
  { id: 'fr-phone-112011785', group: 'galaxy', kind: 'back', from: '#60a5fa', to: '#c084fc', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 Z플립5 256GB', price: '₩18,334', note: '월 최저가 · 24개월 할부', description: '출고가 ₩440,000 · 무약정 · 월 최저가는 ₩18,334이며 24개월 할부 기준입니다. · 색상: 민트 · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/20238226_aZU_1691986516005.jpg' },
  { id: 'fr-phone-111091166', group: 'galaxy', kind: 'punch', from: '#f9a8d4', to: '#fdba74', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S22+ 256GB', price: '₩16,250', note: '월 최저가 · 24개월 할부', description: '출고가 ₩390,000 · 무약정 · 월 최저가는 ₩16,250이며 24개월 할부 기준입니다. · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/20249270_9jn_1727347938067.jpg' },
  { id: 'fr-phone-111091152', group: 'galaxy', kind: 'punch', from: '#fbbf24', to: '#ef4444', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S22 256GB', price: '₩14,167', note: '월 최저가 · 24개월 할부', description: '출고가 ₩340,000 · 무약정 · 월 최저가는 ₩14,167이며 24개월 할부 기준입니다. · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/20248235_feQ_1724288963836.jpg' },
  { id: 'fr-phone-111621177', group: 'iphone', kind: 'island', from: '#22d3ee', to: '#2563eb', badge: '중고', tag: '애플 아이폰', title: '아이폰 SE3 128GB', price: '₩12,084', note: '월 최저가 · 24개월 할부', description: '출고가 ₩290,000 · 무약정 · 월 최저가는 ₩12,084이며 24개월 할부 기준입니다. · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/2024232_KgK_1706776400662.jpg' },
  { id: 'fr-phone-111091171', group: 'galaxy', kind: 'punch', from: '#a78bfa', to: '#ec4899', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S22 울트라 256GB', price: '₩23,334', note: '월 최저가 · 24개월 할부', description: '출고가 ₩560,000 · 무약정 · 월 최저가는 ₩23,334이며 24개월 할부 기준입니다. · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/2023365_oO4_1678081052150.jpg' },
  { id: 'fr-phone-111422969', group: 'iphone', kind: 'island', from: '#4ade80', to: '#0d9488', badge: '중고', tag: '애플 아이폰', title: '아이폰 13 미니 128GB', price: '₩17,084', note: '월 최저가 · 24개월 할부', description: '출고가 ₩410,000 · 무약정 · 월 최저가는 ₩17,084이며 24개월 할부 기준입니다. · 색상: 스타라이트, 핑크 · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/2024232_5gx_1706769642162.jpg' },
  { id: 'fr-phone-110674809', group: 'galaxy', kind: 'punch', from: '#f97316', to: '#be123c', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S21+ 256GB', price: '₩13,334', note: '월 최저가 · 24개월 할부', description: '출고가 ₩320,000 · 무약정 · 월 최저가는 ₩13,334이며 24개월 할부 기준입니다. · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/2023365_dPn_1678091940828.jpg' },
  { id: 'fr-phone-110684829', group: 'galaxy', kind: 'punch', from: '#94a3b8', to: '#475569', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S21 256GB', price: '₩12,292', note: '월 최저가 · 24개월 할부', description: '출고가 ₩295,000 · 무약정 · 월 최저가는 ₩12,292이며 24개월 할부 기준입니다. · 중고 기기이며 색상은 랜덤으로 발송됩니다. · 실제 할부 조건은 신청 화면에서 확인해 주세요.', image: 'https://www.freet.co.kr/upload/product/20239264_m8F_1695264133426.jpg' },
];
