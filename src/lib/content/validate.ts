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
