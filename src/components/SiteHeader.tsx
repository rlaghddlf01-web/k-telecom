'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { MENU, UTILITY_LINKS } from '@/lib/menu';
import { t } from '@/lib/i18n';

export default function SiteHeader() {
  const pathname = usePathname();
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const isActive = (m: (typeof MENU)[number]) =>
    m.children.some((c) => c.href === pathname) || pathname === m.href;

  return (
    <header
      className="sticky top-0 z-40 bg-white"
      onMouseLeave={() => setMega(false)}
    >
      {/* 유틸 줄 */}
      <div className="hidden border-b border-black/5 bg-soft md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-end gap-5 px-4 text-xs text-slate-500">
          {UTILITY_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand">
              {t(l.label)}
            </Link>
          ))}
          <span className="inline-flex items-center gap-1.5 font-bold text-ink">
            <Globe className="h-3.5 w-3.5" /> 한국어
          </span>
        </div>
      </div>

      {/* 메인 줄 */}
      <div className="border-b border-black/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-brand">
            K-Telecom
          </Link>

          <nav
            className="hidden h-full items-stretch gap-1 md:flex"
            onMouseEnter={() => setMega(true)}
            onFocus={() => setMega(true)}
          >
            {MENU.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                className={`flex items-center border-b-2 px-5 text-[15px] font-bold transition-colors ${
                  isActive(m) ? 'border-brand text-brand' : 'border-transparent hover:text-brand'
                }`}
              >
                {t(m.label)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/partnership"
              className="hidden rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-dark sm:inline-flex"
            >
              {t('제휴 신청')}
            </Link>
            <button
              className="p-2 md:hidden"
              aria-label={t('메뉴 열기')}
              onClick={() => setMobile((v) => !v)}
            >
              {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 메가 메뉴 */}
      {mega && (
        <div className="absolute inset-x-0 top-full hidden border-b border-black/10 bg-white shadow-xl md:block">
          <div className="mx-auto grid max-w-7xl grid-cols-6 gap-4 px-4 py-7">
            {MENU.map((m) => (
              <ul key={m.label} className="space-y-2.5">
                {m.children.map((c) => (
                  <li key={c.href + c.label}>
                    <Link
                      href={c.href}
                      onClick={() => setMega(false)}
                      className={`text-sm transition-colors hover:text-brand ${
                        pathname === c.href ? 'font-bold text-brand' : 'text-slate-600'
                      }`}
                    >
                      {t(c.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}

      {/* 모바일 메뉴 */}
      {mobile && (
        <nav className="max-h-[75vh] overflow-y-auto border-b border-black/10 bg-white px-4 py-2 md:hidden">
          {MENU.map((m, i) => (
            <div key={m.label} className="border-b border-black/5 last:border-0">
              <button
                className="flex w-full items-center justify-between py-3.5 text-sm font-bold"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
              >
                {t(m.label)}
                <ChevronDown className={`h-4 w-4 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <ul className="mb-3 space-y-1 rounded-xl bg-soft p-3">
                  {m.children.map((c) => (
                    <li key={c.href + c.label}>
                      <Link
                        href={c.href}
                        onClick={() => setMobile(false)}
                        className="block py-2 text-sm text-slate-600"
                      >
                        {t(c.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-x-5 gap-y-2 py-4 text-xs text-slate-500">
            {UTILITY_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobile(false)}>
                {t(l.label)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
