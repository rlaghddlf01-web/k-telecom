// 관리자가 보낸 내용을 저장 전에 검사·정리한다 (서버에서 사용).
// 링크와 이미지 주소는 javascript: 같은 위험한 형태를 막는다.
import {
  BANNER_POSITIONS,
  THEME_OPTIONS,
  type CompanyInfo,
  type FooterSettings,
  type HeaderSettings,
  type MenuEntry,
  type NavLink,
  type SettingKey,
} from '@/lib/content/types';

import { PAGE_BLOCKS_FIELD, type FieldDef } from '@/lib/content/schema';

type Row = Record<string, unknown>;
export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

const fail = (error: string): Checked<never> => ({ ok: false, error });
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '');

/** 링크: 사이트 안 경로(/...) 또는 https://, http://, tel:, mailto: 만 허용. 빈 값은 허용 */
export function cleanLink(v: unknown): string | null {
  const s = text(v, 500);
  if (s === '') return '';
  if (s.startsWith('/') && !s.startsWith('//') && !/[\s<>"]/.test(s)) return s;
  if (/^(https?:\/\/|tel:|mailto:)[^\s<>"]+$/i.test(s)) return s;
  return null;
}

/** 이미지 주소: 빈 값, 사이트 안 경로, https:// 만 허용. 로컬 메모리 모드에서만 data:image 허용 */
export function cleanImage(v: unknown, allowData: boolean): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  if (s === '') return '';
  if (s.length > 2_500_000) return null;
  if (allowData && /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(s)) return s;
  if (s.length > 1000) return null;
  if (s.startsWith('/') && !s.startsWith('//') && !/[\s<>"]/.test(s)) return s;
  if (/^https:\/\/[^\s<>"]+$/i.test(s)) return s;
  return null;
}

function cleanDate(v: unknown): string | null | undefined {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v !== 'string') return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

const toInt = (v: unknown, fallback = 0) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.max(-9999, Math.min(9999, Math.trunc(n))) : fallback;
};

const POSITION_IDS: string[] = BANNER_POSITIONS.map((p) => p.id);
const THEME_IDS: string[] = THEME_OPTIONS.map((t) => t.id);
const HEX = /^#[0-9a-fA-F]{6}$/;

/** 번역을 넣을 수 있는 언어 (한국어는 본문 컬럼에 두므로 여기에 없음) */
export const I18N_LANGS = ['vi', 'zh', 'en', 'ja', 'ru', 'th', 'uz', 'km', 'mn', 'ne', 'id', 'my', 'si', 'kk', 'bn', 'ur'] as const;

/**
 * 언어별 번역 정리: { vi: { title: '...' }, en: { ... } } 형태만 허용한다.
 * 알 수 없는 언어와 문자열이 아닌 값은 버리고, 전체 크기가 너무 크면 거부(null)한다.
 */
export function cleanI18n(v: unknown): Record<string, Record<string, string>> | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const out: Record<string, Record<string, string>> = {};
  for (const lang of I18N_LANGS) {
    const entry = (v as Row)[lang];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(entry as Row)) {
      if (/^[a-z_]{1,30}$/.test(key) && typeof value === 'string' && value.trim()) fields[key] = value.trim().slice(0, 3000);
    }
    if (Object.keys(fields).length) out[lang] = fields;
  }
  return JSON.stringify(out).length > 30000 ? null : out;
}

/** 입력에 i18n 이 있을 때만 정리해서 넣는다 (없으면 기존 번역을 지우지 않도록 키 자체를 뺀다) */
function i18nPart(input: Row): { i18n?: Record<string, Record<string, string>> } {
  if (input.i18n === undefined) return {};
  return { i18n: cleanI18n(input.i18n) ?? {} };
}

export function sanitizeBanner(input: unknown, allowData: boolean): Checked<Row> {
  if (!input || typeof input !== 'object') return fail('잘못된 요청입니다.');
  const b = input as Row;

  const position = typeof b.position === 'string' && POSITION_IDS.includes(b.position) ? b.position : null;
  if (!position) return fail('배너 위치를 선택해 주세요.');

  const title = text(b.title, 120);
  if (!title) return fail('제목을 입력해 주세요.');

  const link = cleanLink(b.link_url);
  if (link === null) return fail('링크는 /로 시작하는 사이트 안 주소이거나 https:// 로 시작해야 합니다.');

  const image = cleanImage(b.image_url, allowData);
  if (image === null) return fail('이미지 주소가 올바르지 않습니다.');

  const startsAt = cleanDate(b.starts_at);
  const endsAt = cleanDate(b.ends_at);
  if (startsAt === undefined || endsAt === undefined) return fail('노출 기간 날짜가 올바르지 않습니다.');
  if (startsAt && endsAt && startsAt > endsAt) return fail('노출 종료일이 시작일보다 빠릅니다.');

  return {
    ok: true,
    value: {
      position,
      title,
      eyebrow: text(b.eyebrow, 60),
      description: text(b.description, 300),
      button_label: text(b.button_label, 30),
      link_url: link,
      image_url: image,
      theme: typeof b.theme === 'string' && THEME_IDS.includes(b.theme) ? b.theme : 'violet',
      sort_order: toInt(b.sort_order),
      active: b.active !== false,
      starts_at: startsAt,
      ends_at: endsAt,
      ...i18nPart(b),
    },
  };
}

export function sanitizeProduct(input: unknown, allowData: boolean): Checked<Row> {
  if (!input || typeof input !== 'object') return fail('잘못된 요청입니다.');
  const p = input as Row;

  const title = text(p.title, 100);
  if (!title) return fail('상품명을 입력해 주세요.');

  const image = cleanImage(p.image_url, allowData);
  if (image === null) return fail('이미지 주소가 올바르지 않습니다.');

  const from = typeof p.color_from === 'string' && HEX.test(p.color_from) ? p.color_from : '#6d5dfc';
  const to = typeof p.color_to === 'string' && HEX.test(p.color_to) ? p.color_to : '#e8174f';

  return {
    ok: true,
    value: {
      grp: p.grp === 'iphone' || p.grp === 'budget' ? p.grp : 'galaxy',
      tag: text(p.tag, 40),
      title,
      price: text(p.price, 60),
      note: text(p.note, 120),
      badge: text(p.badge, 12),
      description: text(p.description, 2000),
      image_url: image,
      kind: p.kind === 'island' || p.kind === 'back' ? p.kind : 'punch',
      color_from: from,
      color_to: to,
      sort_order: toInt(p.sort_order),
      active: p.active !== false,
      ...i18nPart(p),
    },
  };
}

// ---------------------------------------------------------------------------
// 요금제 · 이벤트 · 공지
// ---------------------------------------------------------------------------
const NETWORK_IDS = ['SKT', 'KT', 'LGU+'];

const money = (v: unknown) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(10_000_000, Math.trunc(n))) : 0;
};

export function sanitizePlan(input: unknown): Checked<Row> {
  if (!input || typeof input !== 'object') return fail('잘못된 요청입니다.');
  const p = input as Row;

  const name = text(p.name, 60);
  if (!name) return fail('요금제 이름을 입력해 주세요.');
  const network = typeof p.network === 'string' && NETWORK_IDS.includes(p.network) ? p.network : null;
  if (!network) return fail('통신망을 선택해 주세요.');

  // 부가 혜택은 배열이나 쉼표로 구분한 글자 모두 받는다 (최대 6개)
  const rawFeatures = Array.isArray(p.features) ? p.features : typeof p.features === 'string' ? p.features.split(',') : [];
  const features = rawFeatures.map((f) => text(f, 30)).filter(Boolean).slice(0, 6);

  const price = money(p.price);
  // 할인가를 비워 두면 정상가와 같게 본다
  const promoPrice = money(p.promo_price) || price;

  return {
    ok: true,
    value: {
      name,
      network,
      data_label: text(p.data_label, 30),
      data_gb: Math.max(0, Math.min(999, toInt(p.data_gb))),
      voice: text(p.voice, 30),
      sms: text(p.sms, 30),
      price,
      promo_price: promoPrice,
      promo_note: text(p.promo_note, 80),
      features,
      badge: text(p.badge, 12),
      sort_order: toInt(p.sort_order),
      active: p.active !== false,
      ...i18nPart(p),
    },
  };
}

const FAQ_CATEGORIES_ALL = ['가입/개통', '요금제', '단말/유심', 'eSIM', '기타'];

export function sanitizeFaq(input: unknown): Checked<Row> {
  if (!input || typeof input !== 'object') return fail('잘못된 요청입니다.');
  const f = input as Row;

  const q = text(f.q, 200);
  const a = text(f.a, 3000);
  if (!q) return fail('질문을 입력해 주세요.');
  if (!a) return fail('답변을 입력해 주세요.');

  return {
    ok: true,
    value: {
      category: typeof f.category === 'string' && FAQ_CATEGORIES_ALL.includes(f.category) ? f.category : '기타',
      q,
      a,
      sort_order: toInt(f.sort_order),
      active: f.active !== false,
      ...i18nPart(f),
    },
  };
}

/** 이벤트·공지 공통 (제목, 기간, 본문, 게시일) */
export function sanitizePost(input: unknown): Checked<Row> {
  if (!input || typeof input !== 'object') return fail('잘못된 요청입니다.');
  const p = input as Row;

  const title = text(p.title, 120);
  if (!title) return fail('제목을 입력해 주세요.');

  let published = typeof p.published_at === 'string' ? p.published_at.trim().slice(0, 10) : '';
  if (!published) published = new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(published) || Number.isNaN(Date.parse(published))) return fail('게시일이 올바르지 않습니다.');

  return {
    ok: true,
    value: {
      title,
      period: text(p.period, 40),
      body: text(p.body, 5000),
      published_at: published,
      sort_order: toInt(p.sort_order),
      active: p.active !== false,
      ...i18nPart(p),
    },
  };
}

// ---------------------------------------------------------------------------
// 헤더·푸터 설정
// ---------------------------------------------------------------------------
function linkList(input: unknown, max: number, label: string): Checked<NavLink[]> {
  if (!Array.isArray(input)) return fail(`${label} 형식이 올바르지 않습니다.`);
  if (input.length > max) return fail(`${label}은(는) 최대 ${max}개까지 등록할 수 있습니다.`);
  const out: NavLink[] = [];
  for (const item of input) {
    const l = text((item as Row)?.label, 30);
    const h = cleanLink((item as Row)?.href);
    if (!l) return fail(`${label}에 이름이 비어 있는 항목이 있습니다.`);
    if (h === null || h === '') return fail(`${label}의 "${l}" 링크가 올바르지 않습니다.`);
    out.push({ label: l, href: h });
  }
  return { ok: true, value: out };
}

function sanitizeHeader(input: unknown): Checked<HeaderSettings> {
  const h = (input ?? {}) as Row;
  if (!Array.isArray(h.menu) || h.menu.length > 8) return fail('메뉴는 최대 8개까지 등록할 수 있습니다.');

  const menu: MenuEntry[] = [];
  for (const entry of h.menu) {
    const e = entry as Row;
    const label = text(e.label, 20);
    const href = cleanLink(e.href);
    if (!label) return fail('이름이 비어 있는 메뉴가 있습니다.');
    if (href === null || href === '') return fail(`메뉴 "${label}"의 링크가 올바르지 않습니다.`);
    const children = linkList(e.children ?? [], 10, `메뉴 "${label}"의 하위 메뉴`);
    if (!children.ok) return children;
    menu.push({ label, href, children: children.value });
  }

  const utility = linkList(h.utility ?? [], 6, '상단 작은 메뉴');
  if (!utility.ok) return utility;

  const ctaHref = cleanLink(h.ctaHref);
  if (ctaHref === null) return fail('오른쪽 위 버튼 링크가 올바르지 않습니다.');

  return {
    ok: true,
    value: {
      logoText: text(h.logoText, 30) || 'K-Telecom',
      menu,
      utility: utility.value,
      ctaLabel: text(h.ctaLabel, 20),
      ctaHref,
    },
  };
}

function sanitizeFooter(input: unknown): Checked<FooterSettings> {
  const f = (input ?? {}) as Row;
  const c = ((f.company ?? {}) as Row);

  const links = linkList(f.links ?? [], 10, '푸터 링크');
  if (!links.ok) return links;
  const publicLinks = linkList(f.publicLinks ?? [], 10, '이용자 보호 링크');
  if (!publicLinks.ok) return publicLinks;

  const company: CompanyInfo = {
    name: text(c.name, 60),
    ceo: text(c.ceo, 30),
    address: text(c.address, 150),
    phone: text(c.phone, 30),
    email: text(c.email, 80),
    bizNumber: text(c.bizNumber, 30),
    salesNumber: text(c.salesNumber, 60),
  };

  return {
    ok: true,
    value: {
      description: text(f.description, 200),
      company,
      links: links.value,
      publicLinks: publicLinks.value,
      copyright: text(f.copyright, 100),
    },
  };
}

export function sanitizeSetting(key: SettingKey, input: unknown): Checked<HeaderSettings | FooterSettings> {
  return key === 'header' ? sanitizeHeader(input) : sanitizeFooter(input);
}

export const isSettingKey = (v: unknown): v is SettingKey => v === 'header' || v === 'footer';

// ---------------------------------------------------------------------------
// 입력 양식 정의(schema.ts)를 그대로 쓰는 범용 검사
// ---------------------------------------------------------------------------
function sanitizeField(f: FieldDef, v: unknown): Checked<unknown> {
  switch (f.kind) {
    case 'text': {
      const s = text(v, f.max ?? 300);
      if (f.required && !s) return fail(`"${f.label}"을(를) 입력해 주세요.`);
      return { ok: true, value: s };
    }
    case 'number': {
      const n = typeof v === 'number' ? v : Number(v);
      if (!Number.isFinite(n)) return { ok: true, value: f.min ?? 0 };
      return { ok: true, value: Math.max(f.min ?? -1e9, Math.min(f.max ?? 1e9, Math.trunc(n))) };
    }
    case 'select': {
      const s = typeof v === 'string' && f.options.some((o) => o.value === v) ? v : null;
      return s === null ? fail(`"${f.label}" 선택이 올바르지 않습니다.`) : { ok: true, value: s };
    }
    case 'link': {
      const link = cleanLink(v);
      return link === null ? fail(`"${f.label}"이(가) 올바르지 않습니다. /로 시작하는 사이트 안 주소이거나 https:// 로 시작해야 합니다.`) : { ok: true, value: link };
    }
    case 'toggle':
      return { ok: true, value: v !== false };
    case 'date': {
      const s = typeof v === 'string' ? v.trim().slice(0, 10) : '';
      if (!s) return { ok: true, value: '' };
      return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) ? { ok: true, value: s } : fail(`"${f.label}" 날짜가 올바르지 않습니다.`);
    }
    case 'strings': {
      const list = Array.isArray(v) ? v : [];
      if (list.length > f.max) return fail(`"${f.label}"은(는) 최대 ${f.max}개까지입니다.`);
      const items = list.map((x) => text(x, f.itemMax ?? 300));
      return { ok: true, value: f.keepEmpty ? items : items.filter(Boolean) };
    }
    case 'list': {
      const list = Array.isArray(v) ? v : [];
      if (list.length > f.max) return fail(`"${f.label}"은(는) 최대 ${f.max}개까지입니다.`);
      const items: Row[] = [];
      for (const item of list) {
        const checked = sanitizeObject(f.item, item);
        if (!checked.ok) return checked;
        items.push(checked.value);
      }
      return { ok: true, value: items };
    }
    case 'variants': {
      const list = Array.isArray(v) ? v : [];
      if (list.length > f.max) return fail(`"${f.label}"은(는) 최대 ${f.max}개까지입니다.`);
      const items: Row[] = [];
      for (const item of list) {
        const type = (item as Row | null)?.type;
        const variant = typeof type === 'string' ? f.variants[type] : undefined;
        if (!variant) return fail('알 수 없는 블록이 있습니다.');
        const checked = sanitizeObject(variant.fields, item);
        if (!checked.ok) return fail(`[${variant.label}] ${checked.error}`);
        items.push({ type, ...checked.value });
      }
      return { ok: true, value: items };
    }
  }
}

export function sanitizeObject(fields: FieldDef[], input: unknown): Checked<Row> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return fail('잘못된 요청입니다.');
  const out: Row = {};
  for (const f of fields) {
    const checked = sanitizeField(f, (input as Row)[f.key]);
    if (!checked.ok) return checked;
    out[f.key] = checked.value;
  }
  return { ok: true, value: out };
}

/** 페이지 본문 블록 검사 (전체 크기도 제한) */
export function sanitizeBlocks(input: unknown): Checked<Row[]> {
  const checked = sanitizeField(PAGE_BLOCKS_FIELD, input);
  if (!checked.ok) return checked;
  if (JSON.stringify(checked.value).length > 120_000) return fail('페이지 내용이 너무 깁니다.');
  return { ok: true, value: checked.value as Row[] };
}

/** 페이지 저장 내용 검사: 제목·설명·본문 블록(선택)·노출 여부 */
export function sanitizePage(input: unknown, allowBlocks: boolean): Checked<{ title: string; lead: string; blocks: Row[] | null; active: boolean; i18n?: Record<string, Record<string, string>> }> {
  if (!input || typeof input !== 'object') return fail('잘못된 요청입니다.');
  const p = input as Row;

  const title = text(p.title, 60);
  if (!title) return fail('페이지 제목을 입력해 주세요.');

  let blocks: Row[] | null = null;
  if (allowBlocks && p.blocks !== undefined && p.blocks !== null) {
    const checked = sanitizeBlocks(p.blocks);
    if (!checked.ok) return checked;
    blocks = checked.value;
  }

  return {
    ok: true,
    value: { title, lead: text(p.lead, 300), blocks, active: p.active !== false, ...i18nPart(p) },
  };
}
