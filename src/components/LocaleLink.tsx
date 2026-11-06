'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLang } from '@/components/LangProvider';
import { localizePath } from '@/lib/langs';

/** next/link 와 같지만 사이트 안 주소에 현재 언어(/vi 등)를 자동으로 붙인다 */
export default function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const lang = useLang();
  return <Link href={typeof href === 'string' ? localizePath(href, lang) : href} {...props} />;
}
