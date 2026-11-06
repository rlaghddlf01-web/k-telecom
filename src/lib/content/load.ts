// 사이트 화면이 쓰는 내용 읽기 (서버 전용).
// 관리자가 아직 등록하지 않은 항목은 기본 내용(지금 사이트 그대로)을 보여주고,
// 저장소에 문제가 있어도 사이트가 비지 않도록 기본 내용으로 돌아간다.
//
// 모든 읽기 함수는 lang(언어 코드, 기본 'ko')을 받는다. 다른 언어를 주면 i18n 컬럼에 입력된 번역이 있는 글자만
// 그 언어로 바꿔 돌려준다 (번역이 없는 글자는 한국어 그대로).
import { cache } from 'react';
import { getPageRow, getSetting, listPageRows, listRows, storeMode, type Row } from '@/lib/server/cmsStore';
import { decodeBlocks } from '@/lib/content/blocks';
import { DEFAULT_HOME, sanitizeHome, type HomeSettings } from '@/lib/content/home';
import { findDedicated, findRegistry } from '@/lib/content/pageIndex';
import type { PageDef } from '@/lib/pages';
import { DEFAULT_BANNERS, DEFAULT_SETTINGS } from '@/lib/content/defaults';
import { sanitizeSetting } from '@/lib/content/validate';
import { PHONES, type Phone, type PhoneGroup } from '@/lib/phones';
import { PLANS, SAMPLE_DATA, type Network, type Plan } from '@/lib/plans';
import { EVENTS, NOTICES, type Post } from '@/lib/boards';
import { FAQS, type Faq } from '@/lib/faq';
import type { Banner, BannerPosition, FooterSettings, HeaderSettings, SiteSettings, ThemeKey } from '@/lib/content/types';

const asString = (v: unknown) => (typeof v === 'string' ? v : '');

/** 번역이 입력되어 있으면 해당 글자만 바꿔 돌려준다 */
function localize(row: Row, lang: string, fields: string[]): Row {
  if (lang === 'ko') return row;
  const t = (row.i18n as Record<string, Record<string, string>> | null | undefined)?.[lang];
  if (!t) return row;
  const out: Row = { ...row };
  for (const f of fields) if (typeof t[f] === 'string' && t[f]) out[f] = t[f];
  return out;
}

const isActive = (r: Row) => r.active !== false;

// ---------------------------------------------------------------------------
// 배너
// ---------------------------------------------------------------------------
function toBanner(r: Row): Banner {
  return {
    id: String(r.id),
    position: r.position as BannerPosition,
    title: asString(r.title),
    eyebrow: asString(r.eyebrow),
    description: asString(r.description),
    button_label: asString(r.button_label),
    link_url: asString(r.link_url),
    image_url: asString(r.image_url),
    theme: (asString(r.theme) || 'violet') as ThemeKey,
    sort_order: Number(r.sort_order ?? 0),
    active: r.active !== false,
    starts_at: typeof r.starts_at === 'string' ? r.starts_at : null,
    ends_at: typeof r.ends_at === 'string' ? r.ends_at : null,
  };
}

const isLive = (now: number) => (b: Banner) =>
  b.active && (!b.starts_at || Date.parse(b.starts_at) <= now) && (!b.ends_at || Date.parse(b.ends_at) >= now);

const loadBanners = cache(async (lang: string): Promise<Banner[] | null> => {
  if (storeMode() === 'none') return null;
  try {
    return (await listRows('banners')).map((r) => toBanner(localize(r, lang, ['title', 'eyebrow', 'description', 'button_label'])));
  } catch (err) {
    console.error('banners load failed:', err instanceof Error ? err.name : 'unknown');
    return null;
  }
});

/** 위치별 노출 중인 배너 (순서대로). 그 위치에 등록한 적이 없으면 기본 배너 */
export async function getBanners(position: BannerPosition, lang = 'ko'): Promise<Banner[]> {
  const all = await loadBanners(lang);
  const defaults = DEFAULT_BANNERS.filter((b) => b.position === position);
  if (!all) return defaults;
  const mine = all.filter((b) => b.position === position);
  if (mine.length === 0) return defaults;
  return mine.filter(isLive(Date.now())).sort((a, b) => a.sort_order - b.sort_order);
}

// ---------------------------------------------------------------------------
// 상품 (스마트폰)
// ---------------------------------------------------------------------------
function toPhone(r: Row): Phone {
  const group = asString(r.grp);
  return {
    id: String(r.id),
    group: (group === 'iphone' || group === 'budget' ? group : 'galaxy') as PhoneGroup,
    image: asString(r.image_url) || undefined,
    kind: r.kind === 'island' || r.kind === 'back' ? r.kind : 'punch',
    from: asString(r.color_from) || '#6d5dfc',
    to: asString(r.color_to) || '#e8174f',
    badge: asString(r.badge) || undefined,
    tag: asString(r.tag),
    title: asString(r.title),
    price: asString(r.price),
    note: asString(r.note),
    description: asString(r.description) || undefined,
  };
}

const loadProducts = cache(async (lang: string): Promise<Phone[]> => {
  if (storeMode() === 'none') return PHONES;
  try {
    const rows = await listRows('products');
    if (rows.length === 0) return PHONES; // 아직 등록한 적이 없으면 기본 상품
    return rows.filter(isActive).map((r) => toPhone(localize(r, lang, ['tag', 'title', 'price', 'note', 'badge', 'description'])));
  } catch (err) {
    console.error('products load failed:', err instanceof Error ? err.name : 'unknown');
    return PHONES;
  }
});

export const getProducts = (lang = 'ko') => loadProducts(lang);

export async function getProduct(id: string, lang = 'ko'): Promise<Phone | undefined> {
  return (await loadProducts(lang)).find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// 요금제
// ---------------------------------------------------------------------------
function toPlan(r: Row): Plan {
  const network = asString(r.network);
  return {
    id: String(r.id),
    name: asString(r.name),
    network: (network === 'SKT' || network === 'LGU+' ? network : 'KT') as Network,
    dataLabel: asString(r.data_label),
    dataGB: Number(r.data_gb ?? 0),
    voice: asString(r.voice),
    sms: asString(r.sms),
    price: Number(r.price ?? 0),
    promoPrice: Number(r.promo_price ?? 0) || Number(r.price ?? 0),
    promoNote: asString(r.promo_note),
    features: Array.isArray(r.features) ? r.features.filter((f): f is string => typeof f === 'string') : [],
    badge: asString(r.badge) || undefined,
  };
}

export interface PlansResult {
  plans: Plan[];
  /** 예시 요금제를 보여주는 중인지 (관리자가 아직 등록하지 않은 경우) */
  sample: boolean;
}

const loadPlans = cache(async (lang: string): Promise<PlansResult> => {
  const fallback: PlansResult = { plans: PLANS, sample: SAMPLE_DATA };
  if (storeMode() === 'none') return fallback;
  try {
    const rows = await listRows('plans');
    if (rows.length === 0) return fallback;
    return {
      plans: rows.filter(isActive).map((r) => toPlan(localize(r, lang, ['name', 'data_label', 'voice', 'sms', 'promo_note', 'badge']))),
      sample: false,
    };
  } catch (err) {
    console.error('plans load failed:', err instanceof Error ? err.name : 'unknown');
    return fallback;
  }
});

export const getPlans = (lang = 'ko') => loadPlans(lang);

export async function getPlan(id: string, lang = 'ko'): Promise<Plan | undefined> {
  return (await loadPlans(lang)).plans.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// 이벤트 · 공지
// ---------------------------------------------------------------------------
function toPost(r: Row): Post {
  return {
    id: String(r.id),
    title: asString(r.title),
    date: asString(r.published_at).slice(0, 10),
    period: asString(r.period) || undefined,
    body: asString(r.body)
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

async function loadPosts(resource: 'events' | 'notices', fallback: Post[], lang: string): Promise<Post[]> {
  if (storeMode() === 'none') return fallback;
  try {
    const rows = await listRows(resource);
    if (rows.length === 0) return fallback;
    return rows.filter(isActive).map((r) => toPost(localize(r, lang, ['title', 'period', 'body'])));
  } catch (err) {
    console.error(`${resource} load failed:`, err instanceof Error ? err.name : 'unknown');
    return fallback;
  }
}

const loadEvents = cache((lang: string) => loadPosts('events', EVENTS, lang));
const loadNotices = cache((lang: string) => loadPosts('notices', NOTICES, lang));

export const getEvents = (lang = 'ko') => loadEvents(lang);
export const getNotices = (lang = 'ko') => loadNotices(lang);

// ---------------------------------------------------------------------------
// 자주 묻는 질문
// ---------------------------------------------------------------------------
const FAQ_CATEGORIES: Faq['category'][] = ['가입/개통', '요금제', '단말/유심', 'eSIM', '기타'];

const loadFaqs = cache(async (lang: string): Promise<Faq[]> => {
  if (storeMode() === 'none') return FAQS;
  try {
    const rows = await listRows('faqs');
    if (rows.length === 0) return FAQS;
    return rows.filter(isActive).map((r0) => {
      const r = localize(r0, lang, ['q', 'a']);
      const category = asString(r.category) as Faq['category'];
      return { category: FAQ_CATEGORIES.includes(category) ? category : '기타', q: asString(r.q), a: asString(r.a) };
    });
  } catch (err) {
    console.error('faqs load failed:', err instanceof Error ? err.name : 'unknown');
    return FAQS;
  }
});

export const getFaqs = (lang = 'ko') => loadFaqs(lang);

// ---------------------------------------------------------------------------
// 서브 페이지 (제목·설명·본문 블록)
// ---------------------------------------------------------------------------
const loadPageRow = cache(async (path: string): Promise<Row | null> => {
  if (storeMode() === 'none') return null;
  try {
    return await getPageRow(path);
  } catch (err) {
    console.error('page load failed:', err instanceof Error ? err.name : 'unknown');
    return null;
  }
});

/** 기능 화면(요금제, 이벤트 …)의 제목·설명: 관리자가 바꿨으면 그 내용, 아니면 기본 문구 */
export async function getPageMeta(path: string, lang = 'ko'): Promise<{ title: string; lead: string }> {
  const base = findDedicated(path) ?? findRegistry(path);
  const defaults = { title: base?.title ?? '', lead: base?.lead ?? '' };
  const row = await loadPageRow(path);
  if (!row || row.active === false) return defaults;
  const r = localize(row, lang, ['title', 'lead']);
  return { title: asString(r.title) || defaults.title, lead: 'lead' in r ? asString(r.lead) : defaults.lead };
}

/** 본문 블록이 있는 페이지(기본 페이지 + 직접 만든 페이지). 없거나 숨김이면 null */
export async function getContentPage(path: string, lang = 'ko'): Promise<PageDef | null> {
  const def = findRegistry(path);
  const row = await loadPageRow(path);
  if (!def && !row) return null;
  if (row && row.active === false) return null;

  const r = row ? localize(row, lang, ['title', 'lead']) : null;
  return {
    path,
    title: (r && asString(r.title)) || def?.title || '',
    lead: r ? asString(r.lead) : def?.lead,
    blocks: r && Array.isArray(r.blocks) ? decodeBlocks(r.blocks) : def?.blocks ?? [],
  };
}

/** 직접 만든 페이지의 주소 목록 (미리 만들어 둘 주소 계산용) */
export async function getCustomPagePaths(): Promise<string[]> {
  if (storeMode() === 'none') return [];
  try {
    return (await listPageRows()).map((r) => asString(r.path)).filter((p) => p && !findRegistry(p) && !findDedicated(p));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// 홈 화면 구성
// ---------------------------------------------------------------------------
export const getHomeSettings = cache(async (): Promise<HomeSettings> => {
  if (storeMode() === 'none') return DEFAULT_HOME;
  try {
    const raw = await getSetting('home');
    if (!raw) return DEFAULT_HOME;
    const checked = sanitizeHome(raw);
    return checked.ok ? checked.value : DEFAULT_HOME;
  } catch (err) {
    console.error('home settings load failed:', err instanceof Error ? err.name : 'unknown');
    return DEFAULT_HOME;
  }
});

// ---------------------------------------------------------------------------
// 헤더 · 푸터
// ---------------------------------------------------------------------------
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  let header: HeaderSettings = DEFAULT_SETTINGS.header;
  let footer: FooterSettings = DEFAULT_SETTINGS.footer;
  if (storeMode() === 'none') return { header, footer };

  try {
    const [h, f] = await Promise.all([getSetting('header'), getSetting('footer')]);
    if (h) {
      const checked = sanitizeSetting('header', h);
      if (checked.ok) header = checked.value as HeaderSettings;
    }
    if (f) {
      const checked = sanitizeSetting('footer', f);
      if (checked.ok) footer = checked.value as FooterSettings;
    }
  } catch (err) {
    console.error('settings load failed:', err instanceof Error ? err.name : 'unknown');
  }
  return { header, footer };
});
