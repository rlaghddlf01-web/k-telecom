import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/server/adminAuth';
import { StoreUnavailableError, setSetting, storeMode } from '@/lib/server/cmsStore';
import { getSiteSettings } from '@/lib/content/load';
import { isSettingKey, sanitizeSetting } from '@/lib/content/validate';

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

/** GET ?key=header|footer : 지금 적용 중인 설정 (등록한 적이 없으면 기본값) */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  const key = req.nextUrl.searchParams.get('key');
  if (!isSettingKey(key)) return json({ error: 'Bad key' }, 400);
  const settings = await getSiteSettings();
  return json({ mode: storeMode(), value: settings[key] });
}

/** PUT { key, value } : 헤더·푸터 설정 저장 */
export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json().catch(() => null);
  if (!body || !isSettingKey(body.key)) return json({ error: 'Bad request' }, 400);

  const checked = sanitizeSetting(body.key, body.value);
  if (!checked.ok) return json({ error: checked.error }, 400);

  try {
    await setSetting(body.key, checked.value);
    revalidatePath('/', 'layout');
    return json({ success: true });
  } catch (err) {
    if (err instanceof StoreUnavailableError) {
      return json({ error: '저장소가 연결되지 않았습니다. Supabase 설정을 먼저 해 주세요.' }, 503);
    }
    console.error('admin settings error:', err instanceof Error ? err.name : 'unknown');
    return json({ error: '처리 중 오류가 발생했습니다.' }, 500);
  }
}
