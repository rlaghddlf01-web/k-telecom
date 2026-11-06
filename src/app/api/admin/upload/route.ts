import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAdminRequest } from '@/lib/server/adminAuth';
import { storeMode } from '@/lib/server/cmsStore';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { clientIp, rateLimit } from '@/lib/server/security';

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

const TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// Vercel 함수는 요청 본문이 4.5MB 까지라서 여유를 두고 3.5MB 로 제한한다
const MAX_BYTES = 3.5 * 1024 * 1024;
// 저장소 없이 로컬에서 시험할 때는 메모리에 그림 데이터를 그대로 넣으므로 작게 제한한다
const MAX_BYTES_MEMORY = 1.5 * 1024 * 1024;

/** 파일 맨 앞 바이트가 실제 이미지 형식인지 확인 (확장자·MIME 위조 방지) */
function matchesSignature(type: string, b: Buffer): boolean {
  switch (type) {
    case 'image/png':
      return b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    case 'image/jpeg':
      return b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case 'image/gif':
      return b.length > 6 && b.subarray(0, 4).toString('ascii') === 'GIF8';
    case 'image/webp':
      return b.length > 12 && b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP';
    default:
      return false;
  }
}

/** POST multipart (file, folder=banners|products) → { url } */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return json({ error: 'Unauthorized' }, 401);
  if (!rateLimit(`admin-upload:${clientIp(req)}`, 60, 10 * 60 * 1000)) {
    return json({ error: '업로드 횟수가 많습니다. 잠시 후 다시 시도해 주세요.' }, 429);
  }

  const mode = storeMode();
  if (mode === 'none') return json({ error: '저장소가 연결되지 않아 이미지를 올릴 수 없습니다.' }, 503);

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return json({ error: '파일을 선택해 주세요.' }, 400);

  const ext = TYPES[file.type];
  if (!ext) return json({ error: 'PNG, JPG, WEBP, GIF 이미지만 올릴 수 있습니다.' }, 400);

  const limit = mode === 'memory' ? MAX_BYTES_MEMORY : MAX_BYTES;
  if (file.size > limit) {
    return json({ error: `이미지 크기는 ${Math.floor(limit / 1024 / 1024 * 10) / 10}MB 이하여야 합니다.` }, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesSignature(file.type, buffer)) return json({ error: '이미지 파일이 올바르지 않습니다.' }, 400);

  if (mode === 'memory') {
    return json({ url: `data:${file.type};base64,${buffer.toString('base64')}` });
  }

  const folderParam = String(form?.get('folder') ?? '');
  const folder = folderParam === 'products' ? 'products' : 'banners';
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const db = getSupabaseAdmin();
  const { error } = await db.storage.from('telecom-media').upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) {
    console.error('upload failed:', error.message.slice(0, 80));
    return json({ error: '이미지 업로드에 실패했습니다. 이미지 보관함 설정(docs/telecom_cms.sql)을 확인해 주세요.' }, 500);
  }
  return json({ url: db.storage.from('telecom-media').getPublicUrl(path).data.publicUrl });
}
