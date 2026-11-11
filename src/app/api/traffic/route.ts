import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/server/supabaseAdmin';
import { clientIp, rateLimit } from '@/lib/server/security';

// 방문 기록: K-Market 과 같은 Supabase 의 kmarket_traffic_logs 테이블에 적재한다.
// 대시보드(K-Market 관리자)에서 source_url 의 도메인(k-telecom.vercel.app)으로 사이트를 구분해 보여준다.

const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

export async function POST(req: Request) {
  // 같은 IP 에서 1분에 30번까지만 기록 (악의적인 도배 방지)
  if (!rateLimit(`traffic:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || typeof body.channelKey !== 'string') {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const sourceUrl = str(body.sourceUrl, 1000);

  // 개발 서버(localhost) 접속은 실제 방문이 아니므로 기록하지 않는다
  try {
    const host = sourceUrl ? new URL(sourceUrl).hostname : '';
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
      return NextResponse.json({ success: true, skipped: 'local' });
    }
  } catch {
    // 주소 형식이 올바르지 않으면 그대로 기록
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false });
  }

  const baseRow = {
    channel_key: str(body.channelKey, 40),
    channel_name: str(body.channelName, 100) ?? str(body.channelKey, 40),
    source_url: sourceUrl,
    utm_source: str(body.utmSource, 200),
    utm_medium: str(body.utmMedium, 200),
    utm_campaign: str(body.utmCampaign, 200),
    referrer: str(body.referrer, 1000),
    created_at: new Date().toISOString(),
  };

  try {
    const db = getSupabaseAdmin();
    let { error } = await db
      .from('kmarket_traffic_logs')
      .insert([{ ...baseRow, visitor_id: str(body.visitorId, 100) }]);

    // visitor_id 컬럼이 아직 없는 DB 라면 ID 없이 다시 기록
    if (error && /visitor_id/i.test(error.message || '')) {
      ({ error } = await db.from('kmarket_traffic_logs').insert([baseRow]));
    }

    if (error) {
      console.warn('traffic log failed:', error.message);
      return NextResponse.json({ success: false });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.warn('traffic log exception:', err);
    return NextResponse.json({ success: false });
  }
}
