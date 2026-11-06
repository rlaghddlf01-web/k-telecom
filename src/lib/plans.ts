/**
 * 요금제 데이터.
 * 아래 항목은 화면 구성을 위한 예시입니다. 실제 요금제 확정 후 이 파일만 교체하면 되고,
 * 그때 SAMPLE_DATA를 false로 바꾸면 "예시" 안내 문구가 사라집니다.
 */
export const SAMPLE_DATA = true;

export type Network = 'SKT' | 'KT' | 'LGU+';

export interface Plan {
  id: string;
  name: string;
  network: Network;
  dataLabel: string;
  /** 정렬·필터용 데이터량(GB). 무제한은 999 */
  dataGB: number;
  voice: string;
  sms: string;
  /** 정상가(원) */
  price: number;
  /** 할인 적용가(원) */
  promoPrice: number;
  promoNote: string;
  features: string[];
  badge?: string;
}

export const PLANS: Plan[] = [
  { id: 'basic-1g', name: '실속 1GB', network: 'LGU+', dataLabel: '1GB', dataGB: 1, voice: '100분', sms: '100건', price: 11000, promoPrice: 9900, promoNote: '할인 종료 후 11,000원', features: ['무료 국제통화 패키지'], badge: '입문용' },
  { id: 'basic-3g', name: '실속 3GB', network: 'LGU+', dataLabel: '3GB', dataGB: 3, voice: '200분', sms: '200건', price: 18700, promoPrice: 15000, promoNote: '할인 종료 후 18,700원', features: ['무료 국제통화 패키지'] },
  { id: 'talk-7g', name: '통화 넉넉 7GB', network: 'KT', dataLabel: '7GB', dataGB: 7, voice: '300분', sms: '100건', price: 29700, promoPrice: 22000, promoNote: '할인 종료 후 29,700원', features: ['무료 국제통화 패키지', 'eSIM 가능'], badge: '인기' },
  { id: 'data-10g', name: '데이터 10GB', network: 'SKT', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공', sms: '200건', price: 46200, promoPrice: 30000, promoNote: '할인 종료 후 46,200원', features: ['eSIM 가능'] },
  { id: 'data-15g', name: '데이터 15GB', network: 'KT', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 44000, promoPrice: 35000, promoNote: '할인 종료 후 44,000원', features: ['무료 국제통화 패키지'] },
  { id: 'data-20g', name: '데이터 20GB', network: 'SKT', dataLabel: '20GB', dataGB: 20, voice: '300분', sms: '300건', price: 63800, promoPrice: 42000, promoNote: '할인 종료 후 63,800원', features: ['eSIM 가능'] },
  { id: 'data-50g', name: '데이터 50GB', network: 'LGU+', dataLabel: '50GB + 5Mbps', dataGB: 50, voice: '기본제공', sms: '기본제공', price: 61600, promoPrice: 52000, promoNote: '할인 종료 후 61,600원', features: ['무료 국제통화 패키지'] },
  { id: 'unlimited', name: '데이터 무제한', network: 'KT', dataLabel: '무제한', dataGB: 999, voice: '기본제공', sms: '기본제공', price: 70000, promoPrice: 59000, promoNote: '할인 종료 후 70,000원', features: ['무료 국제통화 패키지', 'eSIM 가능'], badge: '무제한' },
];

export const NETWORKS: Network[] = ['SKT', 'KT', 'LGU+'];

export function findPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

/** 금액 표기: 한국어는 11,000원, 다른 언어는 11,000 + 그 나라 말의 원 단위(예: KRW, won) */
export const won = (n: number, t: (key: string) => string = (k) => k) => {
  const unit = t('원');
  return unit === '원' ? `${n.toLocaleString('ko-KR')}원` : `${n.toLocaleString('en-US')} ${unit}`;
};
