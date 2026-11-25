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

const SPEC_COLUMNS = ['specs', 'official_url', 'is_new'];
const isMissingSpecColumn = (error: unknown) => SPEC_COLUMNS.some((c) => String((error as { message?: string })?.message ?? '').includes(c));
const withoutSpecColumns = (row: Row): Row => Object.fromEntries(Object.entries(row).filter(([k]) => !SPEC_COLUMNS.includes(k)));

// ---------------------------------------------------------------------------
// 읽기 기억(캐시): 페이지를 한 번 열 때마다 DB 를 열 번 넘게 읽으면 Supabase 의 데이터 전송량(egress) 한도를 금방 넘는다.
// 같은 서버에서는 읽은 내용을 잠깐 기억해 두고, 저장(쓰기)이 일어나면 바로 비운다.
// 다른 서버(Vercel 은 여러 대일 수 있음)에서는 최대 READ_TTL_MS 동안 예전 내용이 보일 수 있다.
// ---------------------------------------------------------------------------
const READ_TTL_MS = 60 * 1000;
const readGlobal = globalThis as unknown as { __ktReadCache?: Map<string, { at: number; promise: Promise<unknown> }> };
const readCache = () => (readGlobal.__ktReadCache ??= new Map());

function memo<T>(key: string, fn: () => Promise<T>, ttl = READ_TTL_MS): Promise<T> {
  const hit = readCache().get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.promise as Promise<T>;
  const promise = fn();
  readCache().set(key, { at: Date.now(), promise });
  promise.catch(() => readCache().delete(key)); // 실패는 기억하지 않는다
  return promise;
}

/** 저장이 일어나면 기억해 둔 읽기를 모두 비운다 */
const clearReadCache = () => readCache().clear();

const byOrder = (a: Row, b: Row) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
const byNewest = (a: Row, b: Row) =>
  String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')) ||
  String(b.created_at ?? '').localeCompare(String(a.created_at ?? ''));

/** fresh: true 면 기억해 둔 것을 쓰지 않고 DB 에서 새로 읽는다 (관리자 화면용) */
export async function listRows(resource: Resource, opts: { fresh?: boolean } = {}): Promise<Row[]> {
  const mode = storeMode();
  if (mode === 'supabase') {
    const read = async (): Promise<Row[]> => {
      let query = getSupabaseAdmin().from(TABLES[resource]).select('*');
      query = isPost(resource)
        ? query.order('published_at', { ascending: false }).order('created_at', { ascending: false })
        : query.order('sort_order', { ascending: true }).order('created_at', { ascending: true });
      const { data, error } = await query.limit(500);
      if (error) throw error;
      return data ?? [];
    };
    return opts.fresh ? read() : memo(`rows:${resource}`, read);
  }
  if (mode === 'memory') return [...memory()[resource]].sort(isPost(resource) ? byNewest : byOrder);
  return [];
}

export async function insertRows(resource: Resource, rows: Row[]): Promise<number> {
  const mode = storeMode();
  if (mode === 'none') throw new StoreUnavailableError();
  if (rows.length === 0) return 0;
  if (mode === 'supabase') {
    // 한 번에 너무 많이 보내지 않도록 50개씩 나눠 저장한다
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50);
      let { error } = await getSupabaseAdmin().from(TABLES[resource]).insert(chunk);
      // 사양 칸을 만드는 SQL(docs/telecom_phone_specs.sql)을 아직 실행하지 않았으면 그 칸만 빼고 다시 저장한다
      if (error && resource === 'products' && isMissingSpecColumn(error)) {
        ({ error } = await getSupabaseAdmin().from(TABLES[resource]).insert(chunk.map(withoutSpecColumns)));
      }
      if (error) throw error;
    }
    clearReadCache();
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
    let { data, error } = await getSupabaseAdmin().from(TABLES[resource]).update(patch).eq('id', id).select('id');
    if (error && resource === 'products' && isMissingSpecColumn(error)) {
      ({ data, error } = await getSupabaseAdmin().from(TABLES[resource]).update(withoutSpecColumns(patch)).eq('id', id).select('id'));
    }
    if (error) throw error;
    clearReadCache();
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
    clearReadCache();
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
    return memo(`setting:${key}`, async () => {
      const { data, error } = await getSupabaseAdmin().from('telecom_settings').select('value').eq('key', key).maybeSingle();
      if (error) throw error;
      return data?.value ?? null;
    });
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
    clearReadCache();
    return;
  }
  memory().settings[key] = value;
}

// ---------------------------------------------------------------------------
// 번역 저장소: 한국어 원문 → 언어별 번역. 한 번 만든 번역은 저장해 두고 다시 쓴다.
// 테이블(telecom_translations)이 없으면 읽기는 빈 결과, 쓰기는 무시한다 (번역이 매번 새로 만들어질 뿐 사이트는 정상).
// ---------------------------------------------------------------------------
export type TranslationOrigin = 'ai' | 'manual';
const trGlobal = globalThis as unknown as { __ktTranslations?: Map<string, { target: string; origin: TranslationOrigin }> };
const trMemory = () => (trGlobal.__ktTranslations ??= new Map());
const trKey = (lang: string, source: string) => `${lang}\u0000${source}`;

// Supabase 번역 읽기 기억: 있는 번역은 30분, 없는 번역은 5분
const TR_HIT_TTL_MS = 30 * 60 * 1000;
const TR_MISS_TTL_MS = 5 * 60 * 1000;
const trCacheGlobal = globalThis as unknown as { __ktTrReadCache?: Map<string, { at: number; target: string | null }> };
const trCache = () => (trCacheGlobal.__ktTrReadCache ??= new Map());

export async function getTranslations(lang: string, sources: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const unique = [...new Set(sources)];
  if (unique.length === 0) return out;
  const mode = storeMode();
  if (mode === 'supabase') {
    // 번역은 거의 바뀌지 않으므로 한 번 읽은 것은 오래 기억한다 (없는 번역도 잠깐 기억해서 매번 DB 를 두드리지 않게 한다)
    const cache = trCache();
    const now = Date.now();
    const missing: string[] = [];
    for (const s of unique) {
      const hit = cache.get(trKey(lang, s));
      if (hit && now - hit.at < (hit.target === null ? TR_MISS_TTL_MS : TR_HIT_TTL_MS)) {
        if (hit.target !== null) out[s] = hit.target;
      } else missing.push(s);
    }
    for (let i = 0; i < missing.length; i += 80) {
      const chunk = missing.slice(i, i + 80);
      const { data, error } = await getSupabaseAdmin().from('telecom_translations').select('source,target').eq('lang', lang).in('source', chunk);
      if (error) return out;
      const found = new Set<string>();
      for (const r of data ?? []) {
        out[String(r.source)] = String(r.target);
        found.add(String(r.source));
        cache.set(trKey(lang, String(r.source)), { at: now, target: String(r.target) });
      }
      for (const s of chunk) if (!found.has(s)) cache.set(trKey(lang, s), { at: now, target: null });
    }
    return out;
  }
  if (mode === 'memory') {
    for (const s of unique) {
      const hit = trMemory().get(trKey(lang, s));
      if (hit) out[s] = hit.target;
    }
  }
  return out;
}

export async function saveTranslations(lang: string, pairs: Record<string, string>, origin: TranslationOrigin = 'ai'): Promise<void> {
  const entries = Object.entries(pairs).filter(([s, t]) => s && t);
  if (entries.length === 0) return;
  const mode = storeMode();
  if (mode === 'supabase') {
    const now = new Date().toISOString();
    const rows = entries.map(([source, target]) => ({ lang, source, target, origin, updated_at: now }));
    // 사람이 직접 고친 번역은 자동 번역이 덮어쓰지 않는다
    if (origin === 'ai') {
      const { error } = await getSupabaseAdmin().from('telecom_translations').upsert(rows, { onConflict: 'lang,source', ignoreDuplicates: true });
      if (error) console.error('translation save failed:', error.code ?? 'unknown');
    } else {
      const { error } = await getSupabaseAdmin().from('telecom_translations').upsert(rows, { onConflict: 'lang,source' });
      if (error) console.error('translation save failed:', error.code ?? 'unknown');
    }
    // 방금 저장한 번역은 바로 기억해 둔다 (사람이 고친 번역은 AI 번역보다 우선이므로 manual 이면 덮어쓴다)
    const cache = trCache();
    for (const [s, t] of entries) {
      const prev = cache.get(trKey(lang, s));
      if (origin === 'ai' && prev?.target) continue;
      cache.set(trKey(lang, s), { at: Date.now(), target: t });
    }
    return;
  }
  if (mode === 'memory') {
    for (const [s, t] of entries) {
      const prev = trMemory().get(trKey(lang, s));
      if (origin === 'ai' && prev) continue;
      trMemory().set(trKey(lang, s), { target: t, origin });
    }
  }
}

// ---------------------------------------------------------------------------
// 서브 페이지 (경로 path 가 기본 키)
// ---------------------------------------------------------------------------
export async function listPageRows(): Promise<Row[]> {
  const mode = storeMode();
  if (mode === 'supabase') {
    return memo('pages:all', async () => {
      const { data, error } = await getSupabaseAdmin().from('telecom_pages').select('*').order('path', { ascending: true }).limit(500);
      if (error) throw error;
      return data ?? [];
    });
  }
  if (mode === 'memory') return Object.values(memory().pages);
  return [];
}

export async function getPageRow(path: string): Promise<Row | null> {
  const mode = storeMode();
  if (mode === 'supabase') {
    return memo(`page:${path}`, async () => {
      const { data, error } = await getSupabaseAdmin().from('telecom_pages').select('*').eq('path', path).maybeSingle();
      if (error) throw error;
      return data ?? null;
    });
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
    clearReadCache();
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
    clearReadCache();
    return (data?.length ?? 0) > 0;
  }
  const had = path in memory().pages;
  delete memory().pages[path];
  return had;
}
