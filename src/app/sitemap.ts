import type { MetadataRoute } from 'next';
import { MENU, FOOTER_LINKS } from '@/lib/menu';
import { PHONES } from '@/lib/phones';
import { PLANS } from '@/lib/plans';
import { EVENTS, NOTICES } from '@/lib/boards';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100';

export default function sitemap(): MetadataRoute.Sitemap {
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
