import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/server/adminAuth';
import {
  StoreUnavailableError,
  deleteRow,
  insertRows,
  listRows,
  storeMode,
  updateRow,
  type Resource,
} from '@/lib/server/cmsStore';
import { sanitizeBanner, sanitizeProduct } from '@/lib/content/validate';
import { DEFAULT_BANNERS } from '@/lib/content/defaults';
import { PHONES } from '@/lib/phones';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Ctx {
  params: Promise<{ resource: string }>;
}

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });
const unauthorized = () => json({ error: 'Unauthorized' }, 401);
const isResource = (v: string): v is Resource => v === 'banners' || v === 'products';

/** 저장이 성공하면 사이트 화면이 바로 새 내용을 쓰도록 캐시를 비운다 */
const refreshSite = () => revalidatePath('/', 'layout');

function handleError(err: unknown) {
  if (err instanceof StoreUnavailableError) {
    return json({ error: '저장소가 연결되지 않았습니다. Supabase 설정을 먼저 해 주세요.' }, 503);
  }
  console.error('admin content error:', err instanceof Error ? err.name : 'unknown');
  return json({ error: '처리 중 오류가 발생했습니다.' }, 500);
}

const sanitize = (resource: Resource, input: unknown) => {
  const allowData = storeMode() === 'memory';
  return resource === 'banners' ? sanitizeBanner(input, allowData) : sanitizeProduct(input, allowData);
};

/** GET: 전체 목록 (노출 여부와 관계없이) */
export async function GET(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) return unauthorized();
  const { resource } = await ctx.params;
  if (!isResource(resource)) return json({ error: 'Not found' }, 404);
  try {
    return json({ mode: storeMode(), rows: await listRows(resource) });
  } catch (err) {
    return handleError(err);
  }
}

/** POST: { action: 'seed' } 기본 내용 가져오기 / 그 외에는 새 항목 등록 */
export async function POST(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) return unauthorized();
  const { resource } = await ctx.params;
  if (!isResource(resource)) return json({ error: 'Not found' }, 404);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ error: 'Bad request' }, 400);

  try {
    if (body.action === 'seed') {
      if ((await listRows(resource)).length > 0) {
        return json({ error: '이미 등록된 내용이 있어 기본 내용을 가져올 수 없습니다.' }, 409);
      }
      const rows =
        resource === 'banners'
          ? DEFAULT_BANNERS.map(({ id: _id, ...rest }) => rest)
          : PHONES.map((p, i) => ({
              grp: p.group,
              tag: p.tag,
              title: p.title,
              price: p.price,
              note: p.note,
              badge: p.badge ?? '',
              description: p.description ?? '',
              image_url: p.image ?? '',
              kind: p.kind,
              color_from: p.from,
              color_to: p.to,
              sort_order: i + 1,
              active: true,
            }));
      const count = await insertRows(resource, rows);
      refreshSite();
      return json({ success: true, count });
    }

    const checked = sanitize(resource, body.item ?? body);
    if (!checked.ok) return json({ error: checked.error }, 400);
    await insertRows(resource, [checked.value]);
    refreshSite();
    return json({ success: true });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PATCH: { id, item } 전체 수정 / { id, active } 노출 켜기·끄기 / { id, sort_order } 순서 변경
 */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) return unauthorized();
  const { resource } = await ctx.params;
  if (!isResource(resource)) return json({ error: 'Not found' }, 404);

  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !UUID_RE.test(body.id)) return json({ error: 'Bad request' }, 400);

  let patch: Record<string, unknown>;
  if (body.item !== undefined) {
    const checked = sanitize(resource, body.item);
    if (!checked.ok) return json({ error: checked.error }, 400);
    patch = checked.value;
  } else if (typeof body.active === 'boolean') {
    patch = { active: body.active };
  } else if (Number.isFinite(body.sort_order)) {
    patch = { sort_order: Math.max(-9999, Math.min(9999, Math.trunc(body.sort_order))) };
  } else {
    return json({ error: 'Nothing to update' }, 400);
  }

  try {
    if (!(await updateRow(resource, body.id, patch))) return json({ error: 'Not found' }, 404);
    refreshSite();
    return json({ success: true });
  } catch (err) {
    return handleError(err);
  }
}

/** DELETE ?id=... */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) return unauthorized();
  const { resource } = await ctx.params;
  if (!isResource(resource)) return json({ error: 'Not found' }, 404);

  const id = req.nextUrl.searchParams.get('id') ?? '';
  if (!UUID_RE.test(id)) return json({ error: 'Bad request' }, 400);

  try {
    if (!(await deleteRow(resource, id))) return json({ error: 'Not found' }, 404);
    refreshSite();
    return json({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
