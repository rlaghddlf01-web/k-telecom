import { NextRequest, NextResponse } from 'next/server';
import { DEV_BYPASS, isAdminRequest } from '@/lib/server/adminAuth';
import { devSampleResponse } from '@/lib/server/devSamples';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/server/supabaseAdmin';
import {
  SEARCH_COLUMNS,
  STATUSES,
  TABLES,
  isKind,
  isStatus,
  type SubmissionKind,
} from '@/lib/server/submissions';
import { URGENT_PREFIX } from '@/lib/server/urgent';
import { RECHARGE_PREFIX } from '@/lib/recharge';


const KINDS: SubmissionKind[] = ['application', 'inquiry', 'partnership'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const serverError = () => NextResponse.json({ error: 'Server error' }, { status: 500 });

/**
 * GET /api/admin/submissions?summary=1                       → 종류·상태별 건수
 * GET /api/admin/submissions?kind=inquiry&status=new&q=검색어 → 목록 (최근 200건)
 */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();

  // 저장소 연결 여부와 관계없이 잘못된 요청은 먼저 거른다
  const params = req.nextUrl.searchParams;
  if (!params.get('summary') && !params.get('planCounts') && !params.get('urgent') && !params.get('recharge') && !isKind(params.get('kind'))) {
    return NextResponse.json({ error: 'Bad kind' }, { status: 400 });
  }
  const statusParam = params.get('status');
  if (statusParam && !isStatus(statusParam)) {
    return NextResponse.json({ error: 'Bad status' }, { status: 400 });
  }

  // 긴급 알림: AI 상담사가 올린 "[긴급:…]" 상담문의 중 아직 처리하지 않은 것 (최근 50건)
  if (params.get('urgent')) {
    if (!isSupabaseConfigured()) {
      // 로컬 개발 모드에서는 화면 확인용 샘플 한 건을 보여준다
      if (DEV_BYPASS) {
        return NextResponse.json({
          sample: true,
          rows: [{ id: '00000000-0000-4000-8000-000000000001', created_at: new Date().toISOString(), name: '긴급 보고(채팅)', phone: '010-0000-0000', message: `${URGENT_PREFIX}유심 미배송] 샘플: 주문한 지 5일이 지났는데 유심이 도착하지 않았다고 합니다.`, status: 'new' }],
        });
      }
      return NextResponse.json({ rows: [] });
    }
    try {
      const { data, error } = await getSupabaseAdmin()
        .from(TABLES.inquiry)
        .select('id, created_at, name, phone, message, status')
        .like('message', `${URGENT_PREFIX}%`)
        .in('status', ['new', 'contacted'])
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return NextResponse.json({ rows: data ?? [] });
    } catch {
      return serverError();
    }
  }

  // 선불 충전 요청: 고객이 남긴 "[충전요청:…]" 상담문의 중 아직 처리하지 않은 것 (최근 50건)
  if (params.get('recharge')) {
    if (!isSupabaseConfigured()) {
      if (DEV_BYPASS) {
        return NextResponse.json({
          sample: true,
          rows: [{ id: '00000000-0000-4000-8000-000000000002', created_at: new Date().toISOString(), name: '충전요청', phone: '01012345678', message: `${RECHARGE_PREFIX}데이터] 선불데이터 안심 (36,000원)`, status: 'new' }],
        });
      }
      return NextResponse.json({ rows: [] });
    }
    try {
      const { data, error } = await getSupabaseAdmin()
        .from(TABLES.inquiry)
        .select('id, created_at, name, phone, message, status')
        .like('message', `${RECHARGE_PREFIX}%`)
        .in('status', ['new', 'contacted'])
        .order('created_at', { ascending: true })
        .limit(50);
      if (error) throw error;
      return NextResponse.json({ rows: data ?? [] });
    } catch {
      return serverError();
    }
  }
  // 요금제별 가입접수 건수 (관리자 요금제 목록의 "가입 많은순" 정렬용)
  if (params.get('planCounts')) {
    if (!isSupabaseConfigured()) return NextResponse.json({ counts: {} });
    try {
      const { data, error } = await getSupabaseAdmin().from(TABLES.application).select('plan_name').limit(5000);
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of data ?? []) counts[row.plan_name] = (counts[row.plan_name] ?? 0) + 1;
      return NextResponse.json({ counts });
    } catch {
      return serverError();
    }
  }

  if (!isSupabaseConfigured()) {
    // 로컬 개발 모드에서는 화면 확인용 샘플 데이터를 보여준다
    if (DEV_BYPASS) return NextResponse.json(devSampleResponse(params));
    return NextResponse.json({ configured: false, rows: [], counts: {} });
  }
  const db = getSupabaseAdmin();

  try {
    if (params.get('summary')) {
      const counts: Record<string, Record<string, number>> = {};
      for (const kind of KINDS) {
        const { data, error } = await db.from(TABLES[kind]).select('status').limit(5000);
        if (error) throw error;
        const byStatus: Record<string, number> = Object.fromEntries(STATUSES.map((s) => [s, 0]));
        for (const row of data ?? []) byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
        counts[kind] = byStatus;
      }
      return NextResponse.json({ configured: true, counts });
    }

    const kind = params.get('kind');
    if (!isKind(kind)) return NextResponse.json({ error: 'Bad kind' }, { status: 400 });

    let query = db.from(TABLES[kind]).select('*').order('created_at', { ascending: false }).limit(200);

    const status = params.get('status');
    if (status) {
      if (!isStatus(status)) return NextResponse.json({ error: 'Bad status' }, { status: 400 });
      query = query.eq('status', status);
    }

    // 검색어: 필터 문법을 깨는 문자는 공백으로 바꾼다
    const q = (params.get('q') ?? '').replace(/[,()%*\\]/g, ' ').trim().slice(0, 50);
    if (q) {
      query = query.or(SEARCH_COLUMNS[kind].map((col) => `${col}.ilike.%${q}%`).join(','));
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ configured: true, rows: data ?? [] });
  } catch (err) {
    console.error('admin submissions GET error:', err instanceof Error ? err.name : 'unknown');
    return serverError();
  }
}

/** PATCH /api/admin/submissions  { kind, id, status?, memo? } → 상태·메모 변경 */
export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  if (!isSupabaseConfigured()) {
    // 로컬 개발 샘플 모드: 저장하지 않고 성공으로만 응답 (화면 동작 확인용)
    if (DEV_BYPASS) return NextResponse.json({ success: true, sample: true });
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !isKind(body.kind) || typeof body.id !== 'string' || !UUID_RE.test(body.id)) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (!isStatus(body.status)) return NextResponse.json({ error: 'Bad status' }, { status: 400 });
    update.status = body.status;
  }
  if (body.memo !== undefined) {
    if (typeof body.memo !== 'string') return NextResponse.json({ error: 'Bad memo' }, { status: 400 });
    update.memo = body.memo.slice(0, 1000);
  }
  if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

  try {
    const { data, error } = await getSupabaseAdmin().from(TABLES[body.kind as SubmissionKind]).update(update).eq('id', body.id).select('id');
    if (error) throw error;
    if (!data || data.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('admin submissions PATCH error:', err instanceof Error ? err.name : 'unknown');
    return serverError();
  }
}
