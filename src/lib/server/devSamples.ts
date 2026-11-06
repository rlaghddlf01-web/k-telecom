// 로컬 개발 전용 샘플 데이터: 저장소(Supabase)가 연결되지 않았을 때 관리자 화면 모양을 확인하기 위한 가짜 데이터.
// NODE_ENV=development 일 때만 사용된다 (배포 환경에서는 호출되지 않음).
import { SEARCH_COLUMNS, STATUSES, isKind, isStatus, type SubmissionKind } from '@/lib/server/submissions';

type Row = Record<string, unknown>;

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const SAMPLES: Record<SubmissionKind, Row[]> = {
  application: [
    { id: id(1), created_at: hoursAgo(1), status: 'new', memo: '', join_type: 'new', network: 'KT', billing: 'post', plan_id: 'talk-7g', plan_name: '통화 넉넉 7GB', sim: 'esim', sim_buy: 'buy', name: '샘플 응우옌', nationality: 'Vietnam', phone: '010-0000-0001', email: null, wish_number: '1234', current_number: null },
    { id: id(2), created_at: hoursAgo(5), status: 'contacted', memo: '내일 오전 재통화', join_type: 'port', network: 'LGU+', billing: 'post', plan_id: 'basic-3g', plan_name: '실속 3GB', sim: 'usim', sim_buy: 'own', name: '샘플 바트', nationality: 'Mongolia', phone: '010-0000-0002', email: 'sample@example.com', wish_number: null, current_number: '010-0000-9999' },
    { id: id(3), created_at: hoursAgo(30), status: 'done', memo: '개통 완료', join_type: 'new', network: 'SKT', billing: 'post', plan_id: 'data-10g', plan_name: '데이터 10GB', sim: 'usim', sim_buy: 'buy', name: '샘플 수니타', nationality: 'Nepal', phone: '010-0000-0003', email: null, wish_number: null, current_number: null },
  ],
  inquiry: [
    { id: id(11), created_at: hoursAgo(2), status: 'new', memo: '', name: '샘플 리', phone: '010-0000-0011', email: null, category: '요금제', message: '무료 국제통화는 어느 나라까지 되나요?' },
    { id: id(12), created_at: hoursAgo(26), status: 'contacted', memo: '', name: '샘플 아이샤', phone: '010-0000-0012', email: 'sample@example.com', category: '스마트폰', message: '아이폰 13 할부 가능한가요?' },
  ],
  partnership: [
    { id: id(21), created_at: hoursAgo(3), status: 'new', memo: '', company: '샘플 통신(주)', name: '김샘플', position: '사업개발팀', phone: '010-0000-0021', email: 'partner@example.com', types: ['알뜰폰 요금제'], message: '제휴 조건을 문의드립니다.' },
  ],
};

/** 개발 모드에서 저장소가 없을 때 /api/admin/submissions GET 에 돌려줄 응답 */
export function devSampleResponse(params: URLSearchParams) {
  if (params.get('summary')) {
    const counts: Record<string, Record<string, number>> = {};
    for (const kind of Object.keys(SAMPLES) as SubmissionKind[]) {
      const byStatus: Record<string, number> = Object.fromEntries(STATUSES.map((s) => [s, 0]));
      for (const row of SAMPLES[kind]) byStatus[String(row.status)] += 1;
      counts[kind] = byStatus;
    }
    return { configured: false, sample: true, counts };
  }

  const kind = params.get('kind');
  if (!isKind(kind)) return { configured: false, sample: true, rows: [] };

  const status = params.get('status');
  const q = (params.get('q') ?? '').trim().toLowerCase();
  const rows = SAMPLES[kind].filter((row) => {
    if (status && isStatus(status) && row.status !== status) return false;
    if (!q) return true;
    return SEARCH_COLUMNS[kind].some((col) => String(row[col] ?? '').toLowerCase().includes(q));
  });
  return { configured: false, sample: true, rows };
}
