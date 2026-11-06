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
}

export const PHONES: Phone[] = [
  { id: 'a-new-1', group: 'galaxy', kind: 'punch', from: '#38bdf8', to: '#6366f1', badge: '신제품', tag: '삼성 갤럭시', title: '갤럭시 A시리즈 미개봉 신제품', price: '기기값 0원', note: '24개월 통신요금 합산 청구' },
  { id: 'a-new-2', group: 'galaxy', kind: 'punch', from: '#f472b6', to: '#a855f7', tag: '삼성 갤럭시', title: '갤럭시 A시리즈 · 라벤더', price: '기기값 0원', note: '미개봉 · 정품' },
  { id: 'a-new-3', group: 'galaxy', kind: 'back', from: '#34d399', to: '#0ea5e9', badge: '인기', tag: '삼성 갤럭시', title: '갤럭시 A시리즈 · 민트', price: '기기값 0원', note: '미개봉 · 정품' },
  { id: 'ip-12', group: 'iphone', kind: 'island', from: '#1e293b', to: '#6366f1', tag: '애플 아이폰', title: '아이폰 12 S급 리퍼비시', price: '초기비용 0원', note: '정품 검수 완료' },
  { id: 'ip-13', group: 'iphone', kind: 'island', from: '#fb7185', to: '#f59e0b', tag: '애플 아이폰', title: '아이폰 13 S급 리퍼비시', price: '초기비용 0원', note: '정품 검수 완료' },
  { id: 'ip-14', group: 'iphone', kind: 'back', from: '#334155', to: '#0f172a', badge: '추천', tag: '애플 아이폰', title: '아이폰 14 S급 리퍼비시', price: '초기비용 0원', note: '정품 검수 완료' },
  { id: 'ip-14b', group: 'iphone', kind: 'island', from: '#60a5fa', to: '#c084fc', tag: '애플 아이폰', title: '아이폰 14 · 블루', price: '초기비용 0원', note: '정품 검수 완료' },
  { id: 'ip-13b', group: 'iphone', kind: 'back', from: '#f9a8d4', to: '#fdba74', tag: '애플 아이폰', title: '아이폰 13 · 핑크', price: '초기비용 0원', note: '정품 검수 완료' },
  { id: 'a-new-4', group: 'galaxy', kind: 'punch', from: '#fbbf24', to: '#ef4444', tag: '삼성 갤럭시', title: '갤럭시 A시리즈 · 선셋', price: '기기값 0원', note: '미개봉 · 정품' },
];
