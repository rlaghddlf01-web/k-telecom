import type { MetadataRoute } from 'next';
import { getEvents, getNotices, getPlans, getProducts, getSiteSettings } from '@/lib/content/load';
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

  return [...paths].map((path) => ({ url: `${SITE_URL}${path}` }));
}
