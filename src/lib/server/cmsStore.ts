// 배너·상품·설정 저장소 (서버 전용).
// - Supabase 가 설정되어 있으면 DB 를 쓴다.
// - 없고 로컬 개발(npm run dev)이면 서버 메모리에 임시 저장한다 (재시작하면 사라짐, 화면 시험용).
// - 둘 다 아니면 저장소 없음 → 읽기는 기본 내용, 쓰기는 거부.
import crypto from 'crypto';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/server/supabaseAdmin';
import { DEV_BYPASS } from '@/lib/server/adminAuth';

export type Resource = 'banners' | 'products' | 'plans' | 'events' | 'notices' | 'faqs';
export type StoreMode = 'supabase' | 'memory' | 'none';
export type Row = Record<string, unknown>;

const TABLES: Record<Resource, string> = {
  banners: 'telecom_banners',
  products: 'telecom_products',
  plans: 'telecom_plans',
  events: 'telecom_events',
  notices: 'telecom_notices',
  faqs: 'telecom_faqs',
};

/** 이벤트·공지는 최신 게시일 순, 나머지는 순서 번호 순으로 보여준다 */
const isPost = (resource: Resource) => resource === 'events' || resource === 'notices';

export class StoreUnavailableError extends Error {
  constructor() {
    super('STORE_UNAVAILABLE');
    this.name = 'StoreUnavailableError';
  }
}

export function storeMode(): StoreMode {
  if (isSupabaseConfigured()) return 'supabase';
  return DEV_BYPASS ? 'memory' : 'none';
}

interface Memory {
  banners: Row[];
  products: Row[];
  plans: Row[];
  events: Row[];
  notices: Row[];
  faqs: Row[];
  pages: Record<string, Row>;
  settings: Record<string, unknown>;
}
const globalRef = globalThis as unknown as { __ktCms?: Partial<Memory> };

/** 개발 서버가 코드를 다시 불러와도 임시 저장소에 빠진 항목이 없도록 항상 채워 둔다 */
function memory(): Memory {
  const m = (globalRef.__ktCms ??= {});
  m.banners ??= [];
  m.products ??= [];
  m.plans ??= [];
  m.events ??= [];
  m.notices ??= [];
  m.faqs ??= [];
  m.pages ??= {};
  m.settings ??= {};
  return m as Memory;
}

const byOrder = (a: Row, b: Row) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
const byNewest = (a: Row, b: Row) =>
  String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')) ||
  String(b.created_at ?? '').localeCompare(String(a.created_at ?? ''));

export async function listRows(resource: Resource): Promise<Row[]> {
  const mode = storeMode();
  if (mode === 'supabase') {
    let query = getSupabaseAdmin().from(TABLES[resource]).select('*');
    query = isPost(resource)
      ? query.order('published_at', { ascending: false }).order('created_at', { ascending: false })
      : query.order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    const { data, error } = await query.limit(500);
    if (error) throw error;
    return data ?? [];
  }
  if (mode === 'memory') return [...memory()[resource]].sort(isPost(resource) ? byNewest : byOrder);
  return [];
}

export async function insertRows(resource: Resource, rows: Row[]): Promise<number> {
  const mode = storeMode();
  if (mode === 'none') throw new StoreUnavailableError();
  if (rows.length === 0) return 0;
  if (mode === 'supabase') {
    const { error } = await getSupabaseAdmin().from(TABLES[resource]).insert(rows);
    if (error) throw error;
    return rows.length;
  }
  const now = new Date().toISOString();
  memory()[resource].push(...rows.map((r) => ({ ...r, id: crypto.randomUUID(), created_at: now })));
  return rows.length;
}

export async function updateRow(resource: Resource, id: string, patch: Row): Promise<boolean> {
  const mode = storeMode();
  if (mode === 'none') throw new StoreUnavailableError();
  if (mode === 'supabase') {
    const { data, error } = await getSupabaseAdmin().from(TABLES[resource]).update(patch).eq('id', id).select('id');
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
  const row = memory()[resource].find((r) => r.id === id);
  if (!row) return false;
  Object.assign(row, patch);
  return true;
}

export async function deleteRow(resource: Resource, id: string): Promise<boolean> {
  const mode = storeMode();
  if (mode === 'none') throw new StoreUnavailableError();
  if (mode === 'supabase') {
    const { data, error } = await getSupabaseAdmin().from(TABLES[resource]).delete().eq('id', id).select('id');
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
  const list = memory()[resource];
  const index = list.findIndex((r) => r.id === id);
  if (index < 0) return false;
  list.splice(index, 1);
  return true;
}

export async function getSetting(key: string): Promise<unknown | null> {
  const mode = storeMode();
  if (mode === 'supabase') {
    const { data, error } = await getSupabaseAdmin().from('telecom_settings').select('value').eq('key', key).maybeSingle();
    if (error) throw error;
    return data?.value ?? null;
  }
  if (mode === 'memory') return memory().settings[key] ?? null;
  return null;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const mode = storeMode();
  if (mode === 'none') throw new StoreUnavailableError();
  if (mode === 'supabase') {
    const { error } = await getSupabaseAdmin()
      .from('telecom_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
    return;
  }
  memory().settings[key] = value;
}

// ---------------------------------------------------------------------------
// 서브 페이지 (경로 path 가 기본 키)
// ---------------------------------------------------------------------------
export async function listPageRows(): Promise<Row[]> {
  const mode = storeMode();
  if (mode === 'supabase') {
    const { data, error } = await getSupabaseAdmin().from('telecom_pages').select('*').order('path', { ascending: true }).limit(500);
    if (error) throw error;
    return data ?? [];
  }
  if (mode === 'memory') return Object.values(memory().pages);
  return [];
}

export async function getPageRow(path: string): Promise<Row | null> {
  const mode = storeMode();
  if (mode === 'supabase') {
    const { data, error } = await getSupabaseAdmin().from('telecom_pages').select('*').eq('path', path).maybeSingle();
    if (error) throw error;
    return data ?? null;
  }
  if (mode === 'memory') return memory().pages[path] ?? null;
  return null;
}

export async function upsertPageRow(row: Row & { path: string }): Promise<void> {
  const mode = storeMode();
  if (mode === 'none') throw new StoreUnavailableError();
  const full = { ...row, updated_at: new Date().toISOString() };
  if (mode === 'supabase') {
    const { error } = await getSupabaseAdmin().from('telecom_pages').upsert(full, { onConflict: 'path' });
    if (error) throw error;
    return;
  }
  memory().pages[row.path] = full;
}

export async function deletePageRow(path: string): Promise<boolean> {
  const mode = storeMode();
  if (mode === 'none') throw new StoreUnavailableError();
  if (mode === 'supabase') {
    const { data, error } = await getSupabaseAdmin().from('telecom_pages').delete().eq('path', path).select('path');
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
  const had = path in memory().pages;
  delete memory().pages[path];
  return had;
}
