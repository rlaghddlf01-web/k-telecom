import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/server/adminAuth';
import { getPlans, getProducts } from '@/lib/content/load';
import { needsTranslation, translateTexts } from '@/lib/server/translate';
import { PUBLIC_LANG_CODES } from '@/lib/langs';

// 번역을 17개 언어로 한꺼번에 만들 수 있어 시간이 걸린다
export const maxDuration = 120;

/**
 * POST { resource: 'products' | 'plans' }
 * 상품(휴대폰) 또는 요금제의 한글 문구를 모든 언어로 번역해서 Supabase 번역 저장소에 저장해 둔다.
 * 이미 사이트 사전이나 저장소에 있는 문구는 다시 번역하지 않으므로, 새 상품을 올린 뒤에만 눌러도 된다.
 */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const resource = body?.resource;
  if (resource !== 'products' && resource !== 'plans') return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  if (!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
    return NextResponse.json({ error: '자동 번역 키(GOOGLE_API_KEY)가 설정되어 있지 않습니다.' }, { status: 503 });
  }

  const texts: string[] =
    resource === 'products'
      ? (await getProducts()).flatMap((p) => [p.title, p.tag, p.note, p.badge ?? '', p.description ?? '', ...(p.specs ?? []).flat()])
      : (await getPlans()).plans.flatMap((p) => [...p.features, p.badge ?? '', /개월 후 [\d,]+원$/.test(p.promoNote) ? '' : p.promoNote]);
  const unique = [...new Set(texts.map((s) => s.trim()).filter(needsTranslation))];

  const langs = PUBLIC_LANG_CODES.filter((l) => l !== 'ko');
  // 사이트 사전에 없는 문구만 저장소·AI 를 거친다 (돌려주는 값은 저장소에서 꺼냈거나 새로 번역한 개수)
  let stored = 0;
  for (const lang of langs) {
    const done = await translateTexts(unique, lang);
    stored += Object.keys(done).length;
  }
  return NextResponse.json({ success: true, languages: langs.length, texts: unique.length, stored });
}
