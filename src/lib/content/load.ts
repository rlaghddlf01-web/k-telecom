// 사이트 화면이 쓰는 내용 읽기 (서버 전용).
// 관리자가 아직 등록하지 않은 항목은 기본 내용(지금 사이트 그대로)을 보여주고,
// 저장소에 문제가 있어도 사이트가 비지 않도록 기본 내용으로 돌아간다.
import { cache } from 'react';
import { getSetting, listRows, storeMode, type Row } from '@/lib/server/cmsStore';
import { DEFAULT_BANNERS, DEFAULT_SETTINGS } from '@/lib/content/defaults';
import { sanitizeSetting } from '@/lib/content/validate';
import { PHONES, type Phone, type PhoneGroup } from '@/lib/phones';
import type { Banner, BannerPosition, FooterSettings, HeaderSettings, SiteSettings, ThemeKey } from '@/lib/content/types';

const asString = (v: unknown) => (typeof v === 'string' ? v : '');

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

const loadBanners = cache(async (): Promise<Banner[] | null> => {
  if (storeMode() === 'none') return null;
  try {
    return (await listRows('banners')).map(toBanner);
  } catch (err) {
    console.error('banners load failed:', err instanceof Error ? err.name : 'unknown');
    return null;
  }
});

/** 위치별 노출 중인 배너 (순서대로). 그 위치에 등록한 적이 없으면 기본 배너 */
export async function getBanners(position: BannerPosition): Promise<Banner[]> {
  const all = await loadBanners();
  const defaults = DEFAULT_BANNERS.filter((b) => b.position === position);
  if (!all) return defaults;
  const mine = all.filter((b) => b.position === position);
  if (mine.length === 0) return defaults;
  return mine.filter(isLive(Date.now())).sort((a, b) => a.sort_order - b.sort_order);
}

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

const loadProducts = cache(async (): Promise<Phone[]> => {
  if (storeMode() === 'none') return PHONES;
  try {
    const rows = await listRows('products');
    if (rows.length === 0) return PHONES; // 아직 등록한 적이 없으면 기본 상품
    return rows.filter((r) => r.active !== false).map(toPhone);
  } catch (err) {
    console.error('products load failed:', err instanceof Error ? err.name : 'unknown');
    return PHONES;
  }
});

export const getProducts = loadProducts;

export async function getProduct(id: string): Promise<Phone | undefined> {
  return (await loadProducts()).find((p) => p.id === id);
}

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
