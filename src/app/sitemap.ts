import type { MetadataRoute } from 'next';
import { MENU, FOOTER_LINKS } from '@/lib/menu';
import { PHONES } from '@/lib/phones';
import { PLANS } from '@/lib/plans';
import { EVENTS, NOTICES } from '@/lib/boards';

import { INDEXING_ALLOWED, SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  // 검색 노출이 막혀 있거나 사이트 주소가 정해지지 않았으면 사이트맵을 비운다 (잘못된 주소가 나가지 않게)
  if (!INDEXING_ALLOWED || !SITE_URL) return [];

  const paths = new Set<string>(['/']);
  MENU.forEach((m) => {
    paths.add(m.href);
    m.children.forEach((c) => paths.add(c.href));
  });
  FOOTER_LINKS.forEach((l) => paths.add(l.href));
  PHONES.forEach((p) => paths.add(`/phones/item/${p.id}`));
  PLANS.forEach((p) => paths.add(`/plans/view/${p.id}`));
  EVENTS.forEach((p) => paths.add(`/events/${p.id}`));
  NOTICES.forEach((p) => paths.add(`/support/notice/${p.id}`));

  return [...paths].map((path) => ({ url: `${SITE_URL}${path}` }));
}
