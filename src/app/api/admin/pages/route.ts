import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/server/adminAuth';
import { StoreUnavailableError, deletePageRow, getPageRow, listPageRows, storeMode, upsertPageRow } from '@/lib/server/cmsStore';
import { DEDICATED_PAGES, checkNewPagePath, findDedicated, findRegistry, type PageKind } from '@/lib/content/pageIndex';
import { encodeBlocks } from '@/lib/content/blocks';
import { sanitizePage } from '@/lib/content/validate';

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });
const str = (v: unknown) => (typeof v === 'string' ? v : '');

function kindOf(path: string): PageKind | null {
  if (findRegistry(path)) return 'registry';
  if (findDedicated(path)) return 'dedicated';
  return null;
}

/** GET : 모든 서브 페이지 목록 / GET ?path=/x : 한 페이지의 지금 적용 내용 */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);

  try {
    const rows = await listPageRows();
    const byPath = new Map(rows.map((r) => [str(r.path), r]));
    const { PAGES } = await import('@/lib/pages');

    const view = (path: string) => {
      const row = byPath.get(path) ?? null;
      const reg = findRegistry(path);
      const ded = findDedicated(path);
      const kind: PageKind = reg ? 'registry' : ded ? 'dedicated' : 'custom';
      const defTitle = reg?.title ?? ded?.title ?? '';
      const defLead = reg?.lead ?? ded?.lead ?? '';
      return {
        path,
        kind,
        edited: !!row,
        active: row ? row.active !== false : true,
        title: row ? str(row.title) || defTitle : defTitle,
        lead: row ? str(row.lead) : defLead,
        blocks: row && Array.isArray(row.blocks) ? row.blocks : reg ? encodeBlocks(reg.blocks) : [],
        i18n: row?.i18n ?? {},
        defaultTitle: defTitle,
      };
    };

    const requested = req.nextUrl.searchParams.get('path');
    if (requested) {
      const known = kindOf(requested) || byPath.has(requested);
      if (!known) return json({ error: 'Not found' }, 404);
      return json({ mode: storeMode(), page: view(requested) });
    }

    const paths = [
      ...PAGES.map((p) => p.path),
      ...DEDICATED_PAGES.map((p) => p.path),
      ...rows.map((r) => str(r.path)).filter((p) => !kindOf(p)),
    ];
    return json({ mode: storeMode(), pages: paths.map(view).map(({ blocks: _b, i18n: _i, ...rest }) => rest) });
  } catch (err) {
    console.error('admin pages error:', err instanceof Error ? err.name : 'unknown');
    return json({ error: '처리 중 오류가 발생했습니다.' }, 500);
  }
}

/** PUT { path, ...page, isNew? } : 저장 (기본 페이지·전용 페이지는 덮어쓰기, 새 페이지는 만들기) */
export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  const body = await req.json().catch(() => null);
  const path = str(body?.path).trim();
  if (!body || !path) return json({ error: 'Bad request' }, 400);

  const kind = kindOf(path);
  if (!kind) {
    // 직접 만든 페이지: 새로 만들 때만 주소를 검사하고, 이미 있으면 수정
    const existing = await getPageRow(path).catch(() => null);
    if (!existing) {
      const bad = checkNewPagePath(path);
      if (bad) return json({ error: bad }, 400);
    }
  }

  // 전용 페이지(목록·신청서 화면)는 제목·설명만 바꿀 수 있다
  const checked = sanitizePage(body, kind !== 'dedicated');
  if (!checked.ok) return json({ error: checked.error }, 400);

  try {
    await upsertPageRow({ path, ...checked.value });
    revalidatePath('/', 'layout');
    return json({ success: true });
  } catch (err) {
    if (err instanceof StoreUnavailableError) {
      return json({ error: '저장소가 연결되지 않았습니다. Supabase 설정을 먼저 해 주세요.' }, 503);
    }
    console.error('admin pages error:', err instanceof Error ? err.name : 'unknown');
    return json({ error: '처리 중 오류가 발생했습니다.' }, 500);
  }
}

/** DELETE ?path=/x : 직접 만든 페이지는 삭제, 기본·전용 페이지는 기본 내용으로 되돌리기 */
export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  const path = req.nextUrl.searchParams.get('path') ?? '';
  if (!path) return json({ error: 'Bad request' }, 400);

  try {
    const removed = await deletePageRow(path);
    if (!removed) return json({ error: 'Not found' }, 404);
    revalidatePath('/', 'layout');
    return json({ success: true });
  } catch (err) {
    if (err instanceof StoreUnavailableError) return json({ error: '저장소가 연결되지 않았습니다.' }, 503);
    console.error('admin pages error:', err instanceof Error ? err.name : 'unknown');
    return json({ error: '처리 중 오류가 발생했습니다.' }, 500);
  }
}
