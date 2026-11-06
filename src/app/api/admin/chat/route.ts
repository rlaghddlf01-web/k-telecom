import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/server/adminAuth';
import { StoreUnavailableError, setSetting, storeMode } from '@/lib/server/cmsStore';
import { getChatSettings } from '@/lib/content/load';
import { sanitizeChat } from '@/lib/content/chat';

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

/** GET : 지금 적용 중인 상담 창 설정 (AI 키가 연결되어 있는지도 알려 준다) */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  return json({ mode: storeMode(), value: await getChatSettings(), aiKeyConfigured: !!process.env.GOOGLE_API_KEY });
}

/** PUT { value } : 상담 창 설정 저장 */
export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: 'Bad request' }, 400);

  const checked = sanitizeChat(body.value);
  if (!checked.ok) return json({ error: checked.error }, 400);

  try {
    await setSetting('chat', checked.value);
    revalidatePath('/', 'layout');
    return json({ success: true });
  } catch (err) {
    if (err instanceof StoreUnavailableError) {
      return json({ error: '저장소가 연결되지 않았습니다. Supabase 설정을 먼저 해 주세요.' }, 503);
    }
    console.error('admin chat error:', err instanceof Error ? err.name : 'unknown');
    return json({ error: '처리 중 오류가 발생했습니다.' }, 500);
  }
}
