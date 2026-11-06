import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/server/adminAuth';
import { StoreUnavailableError, setSetting, storeMode } from '@/lib/server/cmsStore';
import { getHomeSettings } from '@/lib/content/load';
import { sanitizeHome } from '@/lib/content/home';

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

/** GET : 지금 적용 중인 홈 화면 구성 */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  return json({ mode: storeMode(), value: await getHomeSettings() });
}

/** PUT { value } : 홈 화면 구성 저장 */
export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: 'Bad request' }, 400);

  const checked = sanitizeHome(body.value);
  if (!checked.ok) return json({ error: checked.error }, 400);

  try {
    await setSetting('home', checked.value);
    revalidatePath('/', 'layout');
    return json({ success: true });
  } catch (err) {
    if (err instanceof StoreUnavailableError) {
      return json({ error: '저장소가 연결되지 않았습니다. Supabase 설정을 먼저 해 주세요.' }, 503);
    }
    console.error('admin home error:', err instanceof Error ? err.name : 'unknown');
    return json({ error: '처리 중 오류가 발생했습니다.' }, 500);
  }
}
