import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { clientIp, rateLimit } from '@/lib/server/security';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/server/supabaseAdmin';
import { TABLES } from '@/lib/server/submissions';
import { RECHARGE_PREFIX } from '@/lib/recharge';

/**
 * 충전 도우미 프로그램(recharge-helper, 사장님 PC에서 실행)이 쓰는 주소.
 * RECHARGE_WORKER_SECRET 환경변수가 없으면 꺼져 있고, 헤더의 비밀값이 맞아야만 응답한다.
 * - GET  : 아직 처리하지 않은 충전 요청 목록 (번호, 종류, 상품)
 * - POST : { id, status: 'contacted' | 'done' | 'cancelled' } 로 처리 상태를 알린다 (충전 요청 건만 바꿀 수 있다)
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = ['contacted', 'done', 'cancelled'];

function authorized(req: Request): 'disabled' | 'no' | 'yes' {
  const secret = process.env.RECHARGE_WORKER_SECRET;
  if (!secret) return 'disabled';
  const given = Buffer.from(req.headers.get('x-worker-secret') ?? '');
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected) ? 'yes' : 'no';
}

function guard(req: Request): NextResponse | null {
  const a = authorized(req);
  if (a === 'disabled') return NextResponse.json({ error: 'DISABLED' }, { status: 503 });
  if (a === 'no') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  if (!rateLimit(`recharge-worker:${clientIp(req)}`, 120, 60 * 1000)) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  return null;
}

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  if (!isSupabaseConfigured()) return NextResponse.json({ rows: [] });
  try {
    const { data, error } = await getSupabaseAdmin()
      .from(TABLES.inquiry)
      .select('id, created_at, phone, message')
      .like('message', `${RECHARGE_PREFIX}%`)
      .eq('status', 'new')
      .order('created_at', { ascending: true })
      .limit(20);
    if (error) throw error;
    const rows = (data ?? []).map((r) => {
      const m = String(r.message).match(/^\[충전요청:([^\]]+)\]\s*([\s\S]*)$/);
      return { id: r.id, created_at: r.created_at, phone: r.phone, kind: m?.[1] ?? '', item: m?.[2] ?? '' };
    });
    return NextResponse.json({ rows });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !UUID_RE.test(body.id) || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'STORAGE_NOT_CONFIGURED' }, { status: 503 });
  try {
    const { data, error } = await getSupabaseAdmin()
      .from(TABLES.inquiry)
      .update({ status: body.status })
      .eq('id', body.id)
      .like('message', `${RECHARGE_PREFIX}%`)
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
