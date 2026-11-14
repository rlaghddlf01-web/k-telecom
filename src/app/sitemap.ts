import type { MetadataRoute } from 'next';
import { getEvents, getNotices, getPlans, getProducts, getSiteSettings } from '@/lib/content/load';
import { PUBLIC_LANG_CODES, localizePath } from '@/lib/langs';
import { INDEXING_ALLOWED, SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 검색 노출이 막혀 있거나 사이트 주소가 정해지지 않았으면 사이트맵을 비운다 (잘못된 주소가 나가지 않게)
  if (!INDEXING_ALLOWED || !SITE_URL) return [];

  const [{ header, footer }, products, { plans }, events, notices] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getPlans(),
    getEvents(),
    getNotices(),
  ]);

  const paths = new Set<string>(['/']);
  const add = (href: string) => {
    if (href.startsWith('/')) paths.add(href.split('#')[0].split('?')[0] || '/');
  };
  header.menu.forEach((m) => {
    add(m.href);
    m.children.forEach((c) => add(c.href));
  });
  footer.links.forEach((l) => add(l.href));
  products.forEach((p) => paths.add(`/phones/item/${p.id}`));
  plans.forEach((p) => paths.add(`/plans/view/${p.id}`));
  events.forEach((p) => paths.add(`/events/${p.id}`));
  notices.forEach((p) => paths.add(`/support/notice/${p.id}`));

  // 모든 주소를 17개 언어로 내보내고, 서로를 언어 대체 주소로 연결한다
  return [...paths].flatMap((path) => {
    const languages = Object.fromEntries(PUBLIC_LANG_CODES.map((code) => [code, `${SITE_URL}${localizePath(path, code)}`]));
    return PUBLIC_LANG_CODES.map((code) => ({ url: languages[code], alternates: { languages } }));
  });
}
