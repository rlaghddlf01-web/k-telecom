/**
 * 요금제 데이터: 프리티 정책서(2026.11)의 후불 88개 · 선불 25개.
 * - 요금은 정책서의 "기본요금"(price)과 "청구요금"(promoPrice)을 그대로 옮긴 값입니다.
 * - 정책서에는 할인 기간이 없습니다. 프리티 공개 사이트에서는 요금제마다 7·10·12·24개월 또는 평생 할인으로 다르게 표시되므로,
 *   "할인 종료 후 요금"을 단정하지 않고 신청 화면에서 확인하도록 안내합니다.
 * - 수수료·Grade·환수·예치금 같은 대리점 전용 정보는 이 파일에 넣지 않습니다. (파트너 전용 자료)
 * - 매월 정책서가 바뀌면 이 파일만 교체하면 됩니다. (관리자에서 요금제를 등록하면 그쪽이 우선합니다)
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
  { id: 'post-c-01', name: '음성기본7G+1Mbps', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 19800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'], badge: '추천' },
  { id: 'post-c-02', name: '데이터안심10G+1M', network: 'SKT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 24200, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-03', name: '데이터안심300분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 31900, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-04', name: 'USIM데이터중심11G', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 37290, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-05', name: '프리티데이터팡팡', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 53000, promoPrice: 45300, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-06', name: '프리티 글로벌통화 300 7G+', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 39600, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불', '무료 국제통화 패키지', '00700 국제전화 300분'], badge: '국제전화' },
  { id: 'post-c-07', name: '프리티 글로벌통화 300 11G+', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 65890, promoPrice: 47190, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불', '무료 국제통화 패키지', '00700 국제전화 300분'], badge: '국제전화' },
  { id: 'post-c-08', name: '프리티 글로벌통화 300 100G+', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 66000, promoPrice: 55200, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불', '무료 국제통화 패키지', '00700 국제전화 300분'], badge: '국제전화' },
  { id: 'post-c-09', name: '데이터안심7G+', network: 'KT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 19800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'], badge: '추천' },
  { id: 'post-c-10', name: '데이터안심10G+1M', network: 'KT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 37400, promoPrice: 23100, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-11', name: '데이터안심15G+1M', network: 'KT', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 39600, promoPrice: 25300, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-12', name: '데이터안심15G', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 30800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-13', name: '데이터안심300분15G+3Mbps', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 33000, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-14', name: '데이터팡팡', network: 'KT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 53020, promoPrice: 42240, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-15', name: '프리티데이터선택10G', network: 'KT', billing: 'post', dataLabel: '10GB + 매일 2GB + 3Mbps', dataGB: 10, voice: '기본제공 (부가 200분)', sms: '기본제공', price: 58300, promoPrice: 37400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-16', name: 'freeT안심7G+1M', network: 'LGU+', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 19800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'], badge: '추천' },
  { id: 'post-c-17', name: 'freeT안심11G+', network: 'LGU+', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 65890, promoPrice: 37290, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-18', name: 'freeT안심매일5G+', network: 'LGU+', billing: 'post', dataLabel: '매일 5GB + 5Mbps', dataGB: 150, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 56000, promoPrice: 43900, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-19', name: '2030 10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 37400, promoPrice: 23650, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-c-20', name: '2030 100분15G+3M', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-01', name: 'S(유)데이터안심1G+1M', network: 'SKT', billing: 'post', dataLabel: '1GB + 1Mbps', dataGB: 1, voice: '기본제공 (부가 100분)', sms: '기본제공', price: 22000, promoPrice: 19800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-02', name: 'S(유)데이터안심7G+1M', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-03', name: 'S(유)데이터안심10G+1M', network: 'SKT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-04', name: 'S(유)데이터안심100분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-05', name: 'S(유)데이터안심300분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 39600, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-06', name: 'S(유)데이터안심11G+', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-07', name: 'S(유)데이터안심100G+', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 52800, promoPrice: 47300, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-08', name: 'S(유)(5G)데이터안심200G+', network: 'SKT', billing: 'post', dataLabel: '200GB + 5Mbps', dataGB: 200, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 70400, promoPrice: 59400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-09', name: 'L(유)데이터안심7G+1M', network: 'LGU+', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-10', name: 'L(유)데이터안심10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-11', name: 'L(유)데이터안심15G+1M', network: 'LGU+', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 40700, promoPrice: 31900, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-12', name: 'L(유)데이터안심15G+', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 36300, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-13', name: 'L(유)데이터안심300분15G+', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 40700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-14', name: 'L(유)데이터안심11G+', network: 'LGU+', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-n-15', name: 'L(유)데이터안심일5G+', network: 'LGU+', billing: 'post', dataLabel: '매일 5GB + 5Mbps', dataGB: 150, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 56100, promoPrice: 49500, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-01', name: '프리티심플1.1G', network: 'SKT', billing: 'post', dataLabel: '1.1GB', dataGB: 1.1, voice: '50분', sms: '50건', price: 8800, promoPrice: 2750, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-02', name: '심플200분1G', network: 'SKT', billing: 'post', dataLabel: '1GB', dataGB: 1, voice: '200분', sms: '50건', price: 12100, promoPrice: 3520, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-03', name: '프리티심플2G', network: 'SKT', billing: 'post', dataLabel: '2GB', dataGB: 2, voice: '100분', sms: '50건', price: 14300, promoPrice: 5500, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-04', name: '음성기본데이터3G', network: 'SKT', billing: 'post', dataLabel: '3GB', dataGB: 3, voice: '기본제공 (부가 30분)', sms: '100건', price: 24200, promoPrice: 7700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-05', name: '프리티심플4.5G', network: 'SKT', billing: 'post', dataLabel: '4.5GB', dataGB: 4.5, voice: '100분', sms: '50건', price: 25300, promoPrice: 7700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-06', name: '심플350분3G', network: 'SKT', billing: 'post', dataLabel: '3GB', dataGB: 3, voice: '350분', sms: '100건', price: 23100, promoPrice: 7700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-07', name: '든든한100분6G', network: 'SKT', billing: 'post', dataLabel: '6GB', dataGB: 6, voice: '100분', sms: '100건', price: 23100, promoPrice: 9900, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-08', name: '음성기본데이터5G', network: 'SKT', billing: 'post', dataLabel: '5GB', dataGB: 5, voice: '기본제공 (부가 30분)', sms: '150건', price: 27500, promoPrice: 12100, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-09', name: '음성기본데이터10G', network: 'SKT', billing: 'post', dataLabel: '10GB', dataGB: 10, voice: '기본제공 (부가 30분)', sms: '기본제공', price: 34100, promoPrice: 15400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-10', name: '음성기본1G+1M', network: 'SKT', billing: 'post', dataLabel: '1GB + 1Mbps', dataGB: 1, voice: '기본제공 (부가 100분)', sms: '기본제공', price: 22000, promoPrice: 19800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-11', name: 'freeT음성기본7G+1M', network: 'SKT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-12', name: 'freeT데이터안심100분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-13', name: 'freeT데이터안심10G+1M', network: 'SKT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-14', name: 'freeT데이터중심11G+', network: 'SKT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-15', name: 'freeT데이터안심300분15G+', network: 'SKT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 39600, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-16', name: 'freeT데이터팡팡100G+', network: 'SKT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 53000, promoPrice: 47500, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gs-17', name: '5G더빠른200G', network: 'SKT', billing: 'post', dataLabel: '200GB + 5Mbps', dataGB: 200, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 70000, promoPrice: 59000, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-01', name: 'USIM LTE500M', network: 'KT', billing: 'post', dataLabel: '500MB', dataGB: 0.5, voice: '50분', sms: '없음', price: 7150, promoPrice: 3300, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-02', name: 'USIM LTE1G', network: 'KT', billing: 'post', dataLabel: '1GB', dataGB: 1, voice: '50분', sms: '없음', price: 11000, promoPrice: 3850, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-03', name: '프리티데이터23', network: 'KT', billing: 'post', dataLabel: '1.5GB', dataGB: 1.5, voice: '100분', sms: '없음', price: 25300, promoPrice: 4400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-04', name: '프리티든든한6G', network: 'KT', billing: 'post', dataLabel: '6GB', dataGB: 6, voice: '300분', sms: '300건', price: 28600, promoPrice: 8800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-05', name: '심플200분3.5G', network: 'KT', billing: 'post', dataLabel: '3.5GB', dataGB: 3.5, voice: '200분', sms: '100건', price: 22000, promoPrice: 8800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-06', name: '든든한500분10G', network: 'KT', billing: 'post', dataLabel: '10GB', dataGB: 10, voice: '500분', sms: '100건', price: 35200, promoPrice: 13200, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-07', name: '데이터안심3G', network: 'KT', billing: 'post', dataLabel: '3GB + 400Kbps', dataGB: 3, voice: '기본제공 (부가 30분)', sms: '100건', price: 27500, promoPrice: 15400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-08', name: '데이터안심5G(400K)', network: 'KT', billing: 'post', dataLabel: '5GB + 400Kbps', dataGB: 5, voice: '기본제공 (부가 30분)', sms: '150건', price: 30800, promoPrice: 16500, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-09', name: '데이터안심10G(400K)', network: 'KT', billing: 'post', dataLabel: '10GB + 400Kbps', dataGB: 10, voice: '기본제공 (부가 100분)', sms: '300건', price: 37400, promoPrice: 19250, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-10', name: '더든든한500분15G', network: 'KT', billing: 'post', dataLabel: '15GB', dataGB: 15, voice: '500분', sms: '100건', price: 44000, promoPrice: 19800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-11', name: '더든든한500분20G', network: 'KT', billing: 'post', dataLabel: '20GB', dataGB: 20, voice: '500분', sms: '100건', price: 55000, promoPrice: 22000, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-12', name: '더든든한200분30G', network: 'KT', billing: 'post', dataLabel: '30GB', dataGB: 30, voice: '200분', sms: '100건', price: 59400, promoPrice: 26400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-13', name: '음성기본7G(밀리의서재)+1M', network: 'KT', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 35750, promoPrice: 26400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-14', name: '데이터안심10G(CU 멤버십)+1M', network: 'KT', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 37950, promoPrice: 31350, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-15', name: '데이터안심15G(CU 멤버십)+1M', network: 'KT', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 40700, promoPrice: 34100, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-16', name: '데이터안심300분15G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 58300, promoPrice: 41800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-17', name: 'USIM데이터중심11G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 65890, promoPrice: 45540, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-18', name: '데이터안심15G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 56100, promoPrice: 35970, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-19', name: '데이터100G(CU 멤버십)+', network: 'KT', billing: 'post', dataLabel: '100GB + 5Mbps', dataGB: 100, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 55000, promoPrice: 48400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-20', name: '(5G)더빠른110G+', network: 'KT', billing: 'post', dataLabel: '110GB + 5Mbps', dataGB: 110, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 66000, promoPrice: 50600, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gk-21', name: '(5G)더빠른200G+', network: 'KT', billing: 'post', dataLabel: '200GB + 10Mbps', dataGB: 200, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 77000, promoPrice: 59400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-01', name: '심플30분2G', network: 'LGU+', billing: 'post', dataLabel: '2GB', dataGB: 2, voice: '30분', sms: '30건', price: 7700, promoPrice: 4400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-02', name: 'LTE600M', network: 'LGU+', billing: 'post', dataLabel: '600MB', dataGB: 0.6, voice: '50분', sms: '없음', price: 6490, promoPrice: 3190, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-03', name: '심플90분2.5G', network: 'LGU+', billing: 'post', dataLabel: '2.5GB', dataGB: 2.5, voice: '90분', sms: '80건', price: 8800, promoPrice: 4400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-04', name: '심플200분2G', network: 'LGU+', billing: 'post', dataLabel: '2GB', dataGB: 2, voice: '200분', sms: '50건', price: 18700, promoPrice: 5830, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-05', name: '든든한500분6G', network: 'LGU+', billing: 'post', dataLabel: '6GB', dataGB: 6, voice: '500분', sms: '200건', price: 30800, promoPrice: 11000, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-06', name: '데이터안심4.5G+1Mbps', network: 'LGU+', billing: 'post', dataLabel: '4.5GB + 1Mbps', dataGB: 4.5, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 30800, promoPrice: 17050, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-07', name: '데이터안심100분10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '100분', sms: '100건', price: 33000, promoPrice: 19800, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-08', name: '데이터안심무제한7G+', network: 'LGU+', billing: 'post', dataLabel: '7GB + 1Mbps', dataGB: 7, voice: '기본제공', sms: '기본제공', price: 29700, promoPrice: 26400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-09', name: 'freeT안심10G+1M', network: 'LGU+', billing: 'post', dataLabel: '10GB + 1Mbps', dataGB: 10, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 38500, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-10', name: 'freet안심15G+1M', network: 'LGU+', billing: 'post', dataLabel: '15GB + 1Mbps', dataGB: 15, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 40700, promoPrice: 31900, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-11', name: 'freeT foreigner 7G+3M', network: 'LGU+', billing: 'post', dataLabel: '7GB + 3Mbps', dataGB: 7, voice: '500분', sms: '500건', price: 39600, promoPrice: 29700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-12', name: '데이터안심15G', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '100분', sms: '100건', price: 41800, promoPrice: 36300, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-13', name: '데이터안심300분15G+', network: 'LGU+', billing: 'post', dataLabel: '15GB + 3Mbps', dataGB: 15, voice: '300분', sms: '300건', price: 46200, promoPrice: 40700, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-14', name: '유심프리티데이터중심11G+', network: 'LGU+', billing: 'post', dataLabel: '11GB + 매일 2GB + 3Mbps', dataGB: 11, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 49390, promoPrice: 43890, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'post-gl-15', name: '데이터팡팡', network: 'LGU+', billing: 'post', dataLabel: '매일 5GB + 5Mbps', dataGB: 150, voice: '기본제공 (부가 300분)', sms: '기본제공', price: 56000, promoPrice: 49400, promoNote: '할인 기간과 종료 후 요금은 신청 화면에서 확인', features: ['후불'] },
  { id: 'pre-01', name: '선불데이터안심 (2회 충전)', network: 'SKT', billing: 'prepaid', dataLabel: '상담 시 안내', dataGB: 0, voice: '상담 시 안내', sms: '상담 시 안내', price: 36000, promoPrice: 36000, promoNote: '2회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-02', name: '선불데이터안심 (3회 충전)', network: 'SKT', billing: 'prepaid', dataLabel: '상담 시 안내', dataGB: 0, voice: '상담 시 안내', sms: '상담 시 안내', price: 36000, promoPrice: 36000, promoNote: '3회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-03', name: '선불데이터안심', network: 'SKT', billing: 'prepaid', dataLabel: '상담 시 안내', dataGB: 0, voice: '상담 시 안내', sms: '상담 시 안내', price: 36000, promoPrice: 36000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-04', name: '선불데이터11G', network: 'SKT', billing: 'prepaid', dataLabel: '11GB', dataGB: 11, voice: '상담 시 안내', sms: '상담 시 안내', price: 59900, promoPrice: 59900, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-05', name: '선불데이터안심15G+', network: 'SKT', billing: 'prepaid', dataLabel: '15GB', dataGB: 15, voice: '상담 시 안내', sms: '상담 시 안내', price: 39000, promoPrice: 39000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-06', name: '선불데이터100G', network: 'SKT', billing: 'prepaid', dataLabel: '100GB', dataGB: 100, voice: '상담 시 안내', sms: '상담 시 안내', price: 66000, promoPrice: 66000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-07', name: '선불데이터안심300M', network: 'KT', billing: 'prepaid', dataLabel: '300MB', dataGB: 0.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 36000, promoPrice: 36000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-08', name: '선불데이터선택58.5', network: 'KT', billing: 'prepaid', dataLabel: '상담 시 안내', dataGB: 0, voice: '상담 시 안내', sms: '상담 시 안내', price: 58500, promoPrice: 58500, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-09', name: '선불데이터안심15G', network: 'KT', billing: 'prepaid', dataLabel: '15GB', dataGB: 15, voice: '상담 시 안내', sms: '상담 시 안내', price: 39600, promoPrice: 39600, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-10', name: '선불데이터팡팡', network: 'KT', billing: 'prepaid', dataLabel: '상담 시 안내', dataGB: 0, voice: '상담 시 안내', sms: '상담 시 안내', price: 66000, promoPrice: 66000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-11', name: '(5G) 선불데이터20G', network: 'LGU+', billing: 'prepaid', dataLabel: '20GB', dataGB: 20, voice: '상담 시 안내', sms: '상담 시 안내', price: 46200, promoPrice: 46200, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-12', name: '(5G) 선불데이터20G (2회 충전)', network: 'LGU+', billing: 'prepaid', dataLabel: '20GB', dataGB: 20, voice: '상담 시 안내', sms: '상담 시 안내', price: 46200, promoPrice: 46200, promoNote: '2회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-13', name: '(5G) 선불데이터20G (3회 충전)', network: 'LGU+', billing: 'prepaid', dataLabel: '20GB', dataGB: 20, voice: '상담 시 안내', sms: '상담 시 안내', price: 46200, promoPrice: 46200, promoNote: '3회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-14', name: '선불데이터300M', network: 'LGU+', billing: 'prepaid', dataLabel: '300MB', dataGB: 0.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 36300, promoPrice: 36300, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-15', name: '선불데이터300M (2회 충전)', network: 'LGU+', billing: 'prepaid', dataLabel: '300MB', dataGB: 0.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 36300, promoPrice: 36300, promoNote: '2회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-16', name: '선불데이터300M (3회 충전)', network: 'LGU+', billing: 'prepaid', dataLabel: '300MB', dataGB: 0.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 36300, promoPrice: 36300, promoNote: '3회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-17', name: '선불데이터11G', network: 'LGU+', billing: 'prepaid', dataLabel: '11GB', dataGB: 11, voice: '상담 시 안내', sms: '상담 시 안내', price: 50600, promoPrice: 50600, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-18', name: '선불데이터300MB+1Mbps', network: 'LGU+', billing: 'prepaid', dataLabel: '300MB + 1Mbps', dataGB: 0.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 29700, promoPrice: 29700, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-19', name: '선불데이터안심15G', network: 'LGU+', billing: 'prepaid', dataLabel: '15GB', dataGB: 15, voice: '상담 시 안내', sms: '상담 시 안내', price: 39000, promoPrice: 39000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-20', name: '선불데이터안심11G', network: 'LGU+', billing: 'prepaid', dataLabel: '11GB', dataGB: 11, voice: '상담 시 안내', sms: '상담 시 안내', price: 55000, promoPrice: 55000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-21', name: '선불데이터10.3G', network: 'LGU+', billing: 'prepaid', dataLabel: '10.3GB', dataGB: 10.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 38300, promoPrice: 38300, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-22', name: '선불데이터안심10.3G (2회 충전)', network: 'LGU+', billing: 'prepaid', dataLabel: '10.3GB', dataGB: 10.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 38300, promoPrice: 38300, promoNote: '2회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-23', name: '선불데이터안심10.3G (3회 충전)', network: 'LGU+', billing: 'prepaid', dataLabel: '10.3GB', dataGB: 10.3, voice: '상담 시 안내', sms: '상담 시 안내', price: 38300, promoPrice: 38300, promoNote: '3회 충전 상품', features: ['선불'], badge: '선불' },
  { id: 'pre-24', name: '선불데이터일5G+', network: 'LGU+', billing: 'prepaid', dataLabel: '매일 5GB', dataGB: 150, voice: '상담 시 안내', sms: '상담 시 안내', price: 66000, promoPrice: 66000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
  { id: 'pre-25', name: '선불데이터10G', network: 'LGU+', billing: 'prepaid', dataLabel: '10GB', dataGB: 10, voice: '상담 시 안내', sms: '상담 시 안내', price: 33000, promoPrice: 33000, promoNote: '선불 요금제 (충전 후 사용)', features: ['선불'], badge: '선불' },
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
