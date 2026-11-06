// 배너·상품·설정 저장소 (서버 전용).
// - Supabase 가 설정되어 있으면 DB 를 쓴다.
// - 없고 로컬 개발(npm run dev)이면 서버 메모리에 임시 저장한다 (재시작하면 사라짐, 화면 시험용).
// - 둘 다 아니면 저장소 없음 → 읽기는 기본 내용, 쓰기는 거부.
import crypto from 'crypto';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/server/supabaseAdmin';
import { DEV_BYPASS } from '@/lib/server/adminAuth';

export type Resource = 'banners' | 'products';
export type StoreMode = 'supabase' | 'memory' | 'none';
export type Row = Record<string, unknown>;

const TABLES: Record<Resource, string> = { banners: 'telecom_banners', products: 'telecom_products' };

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
  settings: Record<string, unknown>;
}
const globalRef = globalThis as unknown as { __ktCms?: Memory };
const memory = (): Memory => (globalRef.__ktCms ??= { banners: [], products: [], settings: {} });

const byOrder = (a: Row, b: Row) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);

export async function listRows(resource: Resource): Promise<Row[]> {
  const mode = storeMode();
  if (mode === 'supabase') {
    const { data, error } = await getSupabaseAdmin()
      .from(TABLES[resource])
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(500);
    if (error) throw error;
    return data ?? [];
  }
  if (mode === 'memory') return [...memory()[resource]].sort(byOrder);
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
