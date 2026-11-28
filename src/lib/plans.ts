/**
 * 요금제 데이터: 프리티텔레콤 2026.11 개통 정책서(후불 고객중심·국제전화 / 후불 일반 무관리수수료 / 후불 일반 / 선불) 기준.
 * 정책서에 없는 요금제는 개통할 수 없으므로 이 목록만 판매한다. 후불 88개 · 선불 24개.
 * - price = 기본(정상) 요금, promoPrice = 정책서의 청구요금(할인 적용 후 월 요금).
 * - 정책서에는 할인이 몇 개월 적용되는지가 없어서 후불은 promoNote 에 "할인 기간은 가입 상담 시 안내"라고 둔다.
 *   기간을 받으면 promoNote 를 "N개월 후 ○○원" 또는 "평생 할인" 으로 바꿔 주세요.
 * - 수수료·Grade·환수·예치금 같은 대리점 전용 정보는 이 파일에 넣지 않습니다. (파트너 전용 자료)
 * - 단기 유심은 정책서에 가격이 없어 넣지 않았습니다.
 * - 프리티는 매달 정책이 바뀌므로 이 파일을 주기적으로 교체해야 합니다. (관리자에서 요금제를 등록하면 그쪽이 우선합니다)
 */
export const SAMPLE_DATA = false;

export type Network = 'SKT' | 'KT' | 'LGU+';

export interface Plan {
  id: string;
  name: string;
  network: Network;
  /** 후불 / 선불 (없으면 후불) */
  billing?: 'post' | 'prepaid';
  dataLabel: string;
  /** 정렬·필터용 데이터량(GB). 무제한은 999, 매일 N GB 는 N×30 */
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
  { id: 'p-skt-c-1', name: '음성기본7G+1Mbps', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 19800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +5GB (프로모션)'], badge: '추천' },
  { id: 'p-skt-c-2', name: '데이터안심10G+1M', network: 'SKT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 24200, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-c-3', name: '데이터안심300분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 31900, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-c-4', name: 'USIM데이터중심11G', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 37290, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)'] },
  { id: 'p-skt-c-5', name: '프리티데이터팡팡', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 53000, promoPrice: 45300, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)'] },
  { id: 'p-kt-c-6', name: '데이터안심7G+', network: 'KT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 19800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'], badge: '추천' },
  { id: 'p-kt-c-7', name: '데이터안심10G+1M', network: 'KT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 37400, promoPrice: 23100, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-kt-c-8', name: '데이터안심15G+1M', network: 'KT', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 39600, promoPrice: 25300, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-kt-c-9', name: '데이터안심15G', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 30800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-c-10', name: '데이터안심300분15G+3Mbps', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 33000, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-c-11', name: '데이터팡팡', network: 'KT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 53020, promoPrice: 42240, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-c-12', name: '프리티데이터선택10G', network: 'KT', billing: 'post', dataLabel: '10GB + 매일 2GB + 3Mbps', dataGB: 10, voice: '기본제공 (부가 200분)', sms: '기본제공', price: 58300, promoPrice: 37400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-c-13', name: 'freeT안심7G+1M', network: 'LGU+', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 19800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'], badge: '추천' },
  { id: 'p-lgu-c-14', name: 'freeT안심11G+', network: 'LGU+', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 65890, promoPrice: 37290, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-c-15', name: 'freeT안심매일5G+', network: 'LGU+', billing: 'post', dataLabel: '매일 5GB + 5Mbps', dataGB: 150, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 56000, promoPrice: 43900, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-c-16', name: '2030 10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 37400, promoPrice: 23650, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-c-17', name: '2030 100분15G+3M', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-g-1', name: '프리티 글로벌통화 300 7G+', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 39600, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +5GB (프로모션)', '00700 국제전화 300분 무료'], badge: '국제전화' },
  { id: 'p-skt-g-2', name: '프리티 글로벌통화 300 11G+', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 65890, promoPrice: 47190, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)', '00700 국제전화 300분 무료'], badge: '국제전화' },
  { id: 'p-skt-g-3', name: '프리티 글로벌통화 300 100G+', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 66000, promoPrice: 55200, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)', '00700 국제전화 300분 무료'], badge: '국제전화' },
  { id: 'p-skt-n-1', name: 'S(유)데이터안심1G+1M', network: 'SKT', billing: 'post', dataLabel: '1GB + 1Mbps', dataGB: 1, voice: '기본제공 (부가 100분)', sms: '기본제공', price: 22000, promoPrice: 19800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-n-2', name: 'S(유)데이터안심7G+1M', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +5GB (프로모션)'] },
  { id: 'p-skt-n-3', name: 'S(유)데이터안심10G+1M', network: 'SKT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-n-4', name: 'S(유)데이터안심100분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-n-5', name: 'S(유)데이터안심300분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 39600, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-n-6', name: 'S(유)데이터안심11G+', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)'] },
  { id: 'p-skt-n-7', name: 'S(유)데이터안심100G+', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 52800, promoPrice: 47300, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)'] },
  { id: 'p-skt-n-8', name: 'S(유)(5G)데이터안심200G+', network: 'SKT', billing: 'post', dataLabel: '200GB + 5Mbps', dataGB: 200, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 70400, promoPrice: 59400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '5G'] },
  { id: 'p-lgu-n-9', name: 'L(유)데이터안심7G+1M', network: 'LGU+', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-n-10', name: 'L(유)데이터안심10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-n-11', name: 'L(유)데이터안심15G+1M', network: 'LGU+', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 40700, promoPrice: 31900, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-n-12', name: 'L(유)데이터안심15G+', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 36300, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-n-13', name: 'L(유)데이터안심300분15G+', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 40700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-n-14', name: 'L(유)데이터안심11G+', network: 'LGU+', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-n-15', name: 'L(유)데이터안심일5G+', network: 'LGU+', billing: 'post', dataLabel: '매일 5GB + 5Mbps', dataGB: 150, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 56100, promoPrice: 49500, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-1', name: '프리티심플1.1G', network: 'SKT', billing: 'post', dataLabel: '1.1GB', dataGB: 1.1, voice: '50분', sms: '50건', price: 8800, promoPrice: 2750, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-2', name: '심플200분1G', network: 'SKT', billing: 'post', dataLabel: '1GB', dataGB: 1, voice: '200분', sms: '50건', price: 12100, promoPrice: 3520, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-3', name: '프리티심플2G', network: 'SKT', billing: 'post', dataLabel: '2GB', dataGB: 2, voice: '100분', sms: '50건', price: 14300, promoPrice: 5500, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-4', name: '음성기본데이터3G', network: 'SKT', billing: 'post', dataLabel: '3GB', dataGB: 3, voice: '기본제공 (부가 30분)', sms: '100건', price: 24200, promoPrice: 7700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-5', name: '프리티심플4.5G', network: 'SKT', billing: 'post', dataLabel: '4.5GB', dataGB: 4.5, voice: '100분', sms: '100건', price: 25300, promoPrice: 7700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-6', name: '심플350분3G', network: 'SKT', billing: 'post', dataLabel: '3GB', dataGB: 3, voice: '350분', sms: '100건', price: 23100, promoPrice: 7700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-7', name: '든든한100분6G', network: 'SKT', billing: 'post', dataLabel: '6GB', dataGB: 6, voice: '100분', sms: '100건', price: 23100, promoPrice: 9900, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-8', name: '음성기본데이터5G', network: 'SKT', billing: 'post', dataLabel: '5GB', dataGB: 5, voice: '기본제공 (부가 30분)', sms: '150건', price: 27500, promoPrice: 12100, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-9', name: '음성기본데이터10G', network: 'SKT', billing: 'post', dataLabel: '10GB', dataGB: 10, voice: '기본제공 (부가 30분)', sms: '기본제공', price: 34100, promoPrice: 15400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-10', name: '음성기본1G+1M', network: 'SKT', billing: 'post', dataLabel: '1GB + 1Mbps', dataGB: 1, voice: '기본제공 (부가 100분)', sms: '기본제공', price: 22000, promoPrice: 19800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-r-11', name: 'freeT음성기본7G+1M', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +5GB (프로모션)'] },
  { id: 'p-skt-r-12', name: 'freeT데이터안심100분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-r-13', name: 'freeT데이터안심10G+1M', network: 'SKT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-r-14', name: 'freeT데이터중심11G+', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)'] },
  { id: 'p-skt-r-15', name: 'freeT데이터안심300분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 39600, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)'] },
  { id: 'p-skt-r-16', name: 'freeT데이터팡팡100G+', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 53000, promoPrice: 47500, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +20GB (프로모션)'] },
  { id: 'p-skt-r-17', name: '5G더빠른200G', network: 'SKT', billing: 'post', dataLabel: '200GB + 5Mbps', dataGB: 200, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 70000, promoPrice: 59000, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '5G'] },
  { id: 'p-kt-r-18', name: 'USIM LTE500M', network: 'KT', billing: 'post', dataLabel: '500MB', dataGB: 0.5, voice: '50분', sms: '없음', price: 7150, promoPrice: 3300, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-19', name: 'USIM LTE1G', network: 'KT', billing: 'post', dataLabel: '1GB', dataGB: 1, voice: '50분', sms: '없음', price: 11000, promoPrice: 3850, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-20', name: '프리티데이터23', network: 'KT', billing: 'post', dataLabel: '1.5GB', dataGB: 1.5, voice: '100분', sms: '없음', price: 25300, promoPrice: 4400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-21', name: '프리티든든한6G', network: 'KT', billing: 'post', dataLabel: '6GB', dataGB: 6, voice: '300분', sms: '300건', price: 28600, promoPrice: 8800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-22', name: '심플200분3.5G', network: 'KT', billing: 'post', dataLabel: '3.5GB', dataGB: 3.5, voice: '200분', sms: '100건', price: 22000, promoPrice: 8800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-23', name: '든든한500분10G', network: 'KT', billing: 'post', dataLabel: '10GB', dataGB: 10, voice: '500분', sms: '100건', price: 35200, promoPrice: 13200, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-24', name: '데이터안심3G', network: 'KT', billing: 'post', dataLabel: '3GB + 400kbps', dataGB: 3, voice: '기본제공 (부가 30분)', sms: '100건', price: 27500, promoPrice: 15400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-25', name: '데이터안심5G(400K)', network: 'KT', billing: 'post', dataLabel: '5GB + 400kbps', dataGB: 5, voice: '기본제공 (부가 30분)', sms: '150건', price: 30800, promoPrice: 16500, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-26', name: '데이터안심10G(400K)', network: 'KT', billing: 'post', dataLabel: '10GB + 400kbps', dataGB: 10, voice: '기본제공 (부가 100분)', sms: '300건', price: 37400, promoPrice: 19250, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-27', name: '더든든한500분15G', network: 'KT', billing: 'post', dataLabel: '15GB', dataGB: 15, voice: '500분', sms: '100건', price: 44000, promoPrice: 19800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-28', name: '더든든한500분20G', network: 'KT', billing: 'post', dataLabel: '20GB', dataGB: 20, voice: '500분', sms: '100건', price: 55000, promoPrice: 22000, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-29', name: '더든든한200분30G', network: 'KT', billing: 'post', dataLabel: '30GB', dataGB: 30, voice: '200분', sms: '100건', price: 59400, promoPrice: 26400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-kt-r-30', name: '음성기본7G(밀리의서재)+1M', network: 'KT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 35750, promoPrice: 26400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)', '밀리의서재 제휴'] },
  { id: 'p-kt-r-31', name: '데이터안심10G(CU 멤버십)+1M', network: 'KT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 37950, promoPrice: 31350, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)', 'CU 오프라인 20% 할인 (월 5,000원 한도)'] },
  { id: 'p-kt-r-32', name: '데이터안심15G(CU 멤버십)+1M', network: 'KT', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 40700, promoPrice: 34100, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '추가 데이터 +10GB (프로모션)', 'CU 오프라인 20% 할인 (월 5,000원 한도)'] },
  { id: 'p-kt-r-33', name: '데이터안심300분15G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 58300, promoPrice: 41800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', 'CU 오프라인 20% 할인 (월 5,000원 한도)'] },
  { id: 'p-kt-r-34', name: 'USIM데이터11G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 65890, promoPrice: 45540, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', 'CU 오프라인 20% 할인 (월 5,000원 한도)'] },
  { id: 'p-kt-r-35', name: '데이터안심15G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 56100, promoPrice: 35970, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', 'CU 오프라인 20% 할인 (월 5,000원 한도)'] },
  { id: 'p-kt-r-36', name: '데이터100G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 55000, promoPrice: 48400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', 'CU 오프라인 20% 할인 (월 5,000원 한도)'] },
  { id: 'p-kt-r-37', name: '(5G)더빠른110G+', network: 'KT', billing: 'post', dataLabel: '110GB + 5Mbps', dataGB: 110, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 66000, promoPrice: 50600, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '5G'] },
  { id: 'p-kt-r-38', name: '(5G)더빠른200G+', network: 'KT', billing: 'post', dataLabel: '200GB + 10Mbps', dataGB: 200, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 77000, promoPrice: 59400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불', '5G'] },
  { id: 'p-lgu-r-39', name: '심플30분2G', network: 'LGU+', billing: 'post', dataLabel: '2GB', dataGB: 2, voice: '30분', sms: '30건', price: 7700, promoPrice: 4400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-40', name: 'LTE600M', network: 'LGU+', billing: 'post', dataLabel: '600MB', dataGB: 0.6, voice: '50분', sms: '없음', price: 6490, promoPrice: 3190, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-41', name: '심플90분2.5G', network: 'LGU+', billing: 'post', dataLabel: '2.5GB', dataGB: 2.5, voice: '90분', sms: '80건', price: 8800, promoPrice: 4400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-42', name: '심플200분2G', network: 'LGU+', billing: 'post', dataLabel: '2GB', dataGB: 2, voice: '200분', sms: '50건', price: 18700, promoPrice: 5830, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-43', name: '든든한500분6G', network: 'LGU+', billing: 'post', dataLabel: '6GB', dataGB: 6, voice: '500분', sms: '200건', price: 30800, promoPrice: 11000, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-44', name: '데이터안심4.5G+1Mbps', network: 'LGU+', billing: 'post', dataLabel: '4.5GB + 1Mbps', dataGB: 4.5, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 30800, promoPrice: 17050, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-45', name: '데이터안심100분10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '100분', sms: '100건', price: 33000, promoPrice: 19800, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-46', name: '데이터안심무제한7G+', network: 'LGU+', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-47', name: 'freeT안심10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-48', name: 'freet안심15G+1M', network: 'LGU+', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 40700, promoPrice: 31900, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-49', name: 'freeT foreigner 7G+3M', network: 'LGU+', billing: 'post', dataLabel: '7GB + 3Mbps', dataGB: 7, voice: '500분', sms: '500건', price: 39600, promoPrice: 29700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-50', name: '데이터안심15G', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 36300, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-51', name: '데이터안심300분15G+', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 40700, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-52', name: '유심프리티데이터중심11G+', network: 'LGU+', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-lgu-r-53', name: '데이터팡팡', network: 'LGU+', billing: 'post', dataLabel: '매일 5GB + 5Mbps', dataGB: 150, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 56000, promoPrice: 49400, promoNote: '할인 기간은 가입 상담 시 안내', features: ['후불'] },
  { id: 'p-skt-s-3', name: '선불데이터안심', network: 'SKT', billing: 'prepaid', dataLabel: '요금제 상세는 상담 시 안내', dataGB: 0, voice: '기본제공', sms: '기본제공', price: 36000, promoPrice: 36000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-skt-s-4', name: '선불데이터11G', network: 'SKT', billing: 'prepaid', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 59900, promoPrice: 59900, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-skt-s-5', name: '선불데이터안심15G+', network: 'SKT', billing: 'prepaid', dataLabel: '15GB', dataGB: 15, voice: '기본제공', sms: '기본제공', price: 39000, promoPrice: 39000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-skt-s-6', name: '선불데이터100G', network: 'SKT', billing: 'prepaid', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 66000, promoPrice: 66000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-kt-s-7', name: '선불데이터안심300M', network: 'KT', billing: 'prepaid', dataLabel: '300MB + 3Mbps', dataGB: 0.3, voice: '기본제공 (부가 30분)', sms: '기본제공', price: 36000, promoPrice: 36000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-kt-s-8', name: '선불데이터선택58.5', network: 'KT', billing: 'prepaid', dataLabel: '10GB + 매일 2GB + 3Mbps', dataGB: 10, voice: '기본제공 (부가 200분)', sms: '기본제공', price: 58500, promoPrice: 58500, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-kt-s-9', name: '선불데이터안심15G', network: 'KT', billing: 'prepaid', dataLabel: '15GB', dataGB: 15, voice: '기본제공', sms: '기본제공', price: 39600, promoPrice: 39600, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-kt-s-10', name: '선불데이터팡팡', network: 'KT', billing: 'prepaid', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 66000, promoPrice: 66000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-11', name: '(5G) 선불데이터20G', network: 'LGU+', billing: 'prepaid', dataLabel: '20GB + 3Mbps', dataGB: 20, voice: '기본제공 (부가 50분)', sms: '기본제공', price: 46200, promoPrice: 46200, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불', '5G'], badge: '선불' },
  { id: 'p-lgu-s-13', name: '선불데이터300M', network: 'LGU+', billing: 'prepaid', dataLabel: '300MB', dataGB: 0.3, voice: '기본제공', sms: '기본제공', price: 36300, promoPrice: 36300, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-16', name: '선불데이터11G', network: 'LGU+', billing: 'prepaid', dataLabel: '11GB', dataGB: 11, voice: '기본제공', sms: '기본제공', price: 50600, promoPrice: 50600, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-17', name: '선불데이터300MB+1Mbps', network: 'LGU+', billing: 'prepaid', dataLabel: '300MB + 1Mbps', dataGB: 0.3, voice: '기본제공 (부가 50분)', sms: '기본제공', price: 29700, promoPrice: 29700, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-18', name: '선불데이터안심15G', network: 'LGU+', billing: 'prepaid', dataLabel: '15GB', dataGB: 15, voice: '기본제공', sms: '기본제공', price: 39000, promoPrice: 39000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-19', name: '선불데이터안심11G', network: 'LGU+', billing: 'prepaid', dataLabel: '11GB', dataGB: 11, voice: '기본제공', sms: '기본제공', price: 55000, promoPrice: 55000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-20', name: '선불데이터안심10.3G', network: 'LGU+', billing: 'prepaid', dataLabel: '10.3GB + 3Mbps', dataGB: 10.3, voice: '기본제공 (부가 50분)', sms: '기본제공', price: 38300, promoPrice: 38300, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-23', name: '선불데이터일5G+', network: 'LGU+', billing: 'prepaid', dataLabel: '매일 5GB + 5Mbps', dataGB: 150, voice: '기본제공', sms: '기본제공', price: 66000, promoPrice: 66000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'p-lgu-s-24', name: '선불데이터10G', network: 'LGU+', billing: 'prepaid', dataLabel: '10GB', dataGB: 10, voice: '기본제공', sms: '기본제공', price: 33000, promoPrice: 33000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
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
