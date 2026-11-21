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
  /** 사양 표: [항목 이름(번역 키), 값] 목록. 없으면 phoneExtras.ts 의 기본 사양을 제목으로 찾아 쓴다 */
  specs?: [string, string][];
  /** 제조사 공식 사양 페이지 주소 */
  official?: string;
  /** 새 제품이면 상품 구성(구성품)을 보여 준다 */
  isNew?: boolean;
}

/**
 * 휴대폰 데이터: 프리티 공개 홈페이지(freet.co.kr)의 휴대폰 구매 목록 (2026-11-22 기준) 14개.
 * price 는 프리티가 보여 주는 "월 최저가"(24개월 할부 기준)이고, 출고가·색상 같은 사양은 phoneExtras.ts 에 있습니다.
 * 사진은 삼성·애플 공식 사이트(삼성닷컴, 삼성 지원 모델 페이지, 애플 지원 사양 페이지)에서 내려받아 여백을 잘라 public/images/phones 에 두었습니다.
 * (사진 사용 허락은 확인이 필요합니다. 프리티 이미지는 주소가 바뀌면 깨질 수 있습니다)
 * 관리자에서 상품을 등록하면 그쪽이 우선합니다.
 */
export const PHONES: Phone[] = [
  { id: 'fr-phone-113618060', group: 'galaxy', kind: 'back', from: '#38bdf8', to: '#6366f1', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 Z폴드8 울트라 512GB', price: '월 110,834원', note: '월 최저가 · 24개월 할부', image: '/images/phones/z-fold8-ultra-512.webp' },
  { id: 'fr-phone-113618016', group: 'galaxy', kind: 'back', from: '#f472b6', to: '#a855f7', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 Z폴드8 512GB', price: '월 102,296원', note: '월 최저가 · 24개월 할부', image: '/images/phones/z-fold8-512.webp' },
  { id: 'fr-phone-113613320', group: 'galaxy', kind: 'back', from: '#34d399', to: '#0ea5e9', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 Z플립8 512GB', price: '월 75,788원', note: '월 최저가 · 24개월 할부', image: '/images/phones/z-flip8-512.webp' },
  { id: 'fr-phone-113504537', group: 'galaxy', kind: 'punch', from: '#1e293b', to: '#6366f1', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 S26 울트라 512GB', price: '월 85,434원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s26-ultra-512.webp' },
  { id: 'fr-phone-113504453', group: 'galaxy', kind: 'punch', from: '#fb7185', to: '#f59e0b', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 S26+ 512GB', price: '월 71,042원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s26-plus-512.webp' },
  { id: 'fr-phone-113504430', group: 'galaxy', kind: 'punch', from: '#334155', to: '#0f172a', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 S26 512GB', price: '월 62,792원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s26-512.webp' },
  { id: 'fr-phone-112011785', group: 'galaxy', kind: 'back', from: '#60a5fa', to: '#c084fc', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 Z플립5 256GB', price: '월 18,334원', note: '월 최저가 · 24개월 할부', image: '/images/phones/z-flip5-256.webp' },
  { id: 'fr-phone-111091166', group: 'galaxy', kind: 'punch', from: '#f9a8d4', to: '#fdba74', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S22+ 256GB', price: '월 16,250원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s22-plus-256.webp' },
  { id: 'fr-phone-111091152', group: 'galaxy', kind: 'punch', from: '#fbbf24', to: '#ef4444', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S22 256GB', price: '월 14,167원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s22-256.webp' },
  { id: 'fr-phone-111621177', group: 'iphone', kind: 'island', from: '#22d3ee', to: '#2563eb', badge: '중고', tag: '애플 아이폰', title: '아이폰 SE3 128GB', price: '월 12,084원', note: '월 최저가 · 24개월 할부', image: '/images/phones/iphone-se3-128.webp' },
  { id: 'fr-phone-111091171', group: 'galaxy', kind: 'punch', from: '#a78bfa', to: '#ec4899', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S22 울트라 256GB', price: '월 23,334원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s22-ultra-256.webp' },
  { id: 'fr-phone-111422969', group: 'iphone', kind: 'island', from: '#4ade80', to: '#0d9488', badge: '중고', tag: '애플 아이폰', title: '아이폰 13 미니 128GB', price: '월 17,084원', note: '월 최저가 · 24개월 할부', image: '/images/phones/iphone-13-mini-128.webp' },
  { id: 'fr-phone-110674809', group: 'galaxy', kind: 'punch', from: '#f97316', to: '#be123c', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S21+ 256GB', price: '월 13,334원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s21-plus-256.webp' },
  { id: 'fr-phone-110684829', group: 'galaxy', kind: 'punch', from: '#94a3b8', to: '#475569', badge: '중고', tag: '삼성 갤럭시', title: '갤럭시 S21 256GB', price: '월 12,292원', note: '월 최저가 · 24개월 할부', image: '/images/phones/s21-256.webp' },
];
