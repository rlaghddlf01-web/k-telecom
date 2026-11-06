'use client';

import Link from '@/components/LocaleLink';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import SmartLink from '@/components/SmartLink';
import type { HeaderSettings, MenuEntry } from '@/lib/content/types';
import { useLang, useT } from '@/components/LangProvider';
import { openLanguageGate } from '@/components/LanguageGate';
import { flagUrl, langInfo, stripLang } from '@/lib/langs';

export default function SiteHeaderView({ header }: { header: HeaderSettings }) {
  const t = useT();
  const lang = useLang();
  const pathname = stripLang(usePathname());
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const isActive = (m: MenuEntry) => m.children.some((c) => c.href === pathname) || pathname === m.href;
  // 하위 메뉴가 하나라도 있는 메뉴가 있을 때만 메가 메뉴를 보여준다
  const hasMega = header.menu.some((m) => m.children.length > 0);
  const columns = Math.min(Math.max(header.menu.length, 1), 6);

  return (
    <header className="sticky top-0 z-40 bg-white" onMouseLeave={() => setMega(false)}>
      {/* 유틸 줄 */}
      <div className="hidden border-b border-black/5 bg-soft md:block">
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-5 px-4 text-xs text-slate-500">
          {/* 언어 변경: 눈에 띄는 버튼 (누르면 17개 언어 선택 창이 열린다) */}
          <button
            onClick={openLanguageGate}
            aria-label="Language"
            className="inline-flex items-center gap-2 rounded-full bg-brand py-1.5 pl-2 pr-3.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={flagUrl(langInfo(lang).flag)} alt="" className="h-4 w-6 rounded-[3px] object-cover ring-1 ring-white/50" />
            <Globe className="h-3.5 w-3.5" />
            {langInfo(lang).name}
            <ChevronDown className="h-3 w-3" />
          </button>
          <div className="flex items-center gap-5">
            {header.utility.map((l) => (
              <SmartLink key={l.href + l.label} href={l.href} className="hover:text-brand">
                {t(l.label)}
              </SmartLink>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 줄 */}
      <div className="border-b border-black/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-brand">
            {header.logoText}
          </Link>

          <nav
            className="hidden h-full items-stretch gap-1 md:flex"
            onMouseEnter={() => hasMega && setMega(true)}
            onFocus={() => hasMega && setMega(true)}
          >
            {header.menu.map((m) => (
              <SmartLink
                key={m.label + m.href}
                href={m.href}
                className={`flex items-center border-b-2 px-5 text-[15px] font-bold transition-colors ${
                  isActive(m) ? 'border-brand text-brand' : 'border-transparent hover:text-brand'
                }`}
              >
                {t(m.label)}
              </SmartLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {header.ctaLabel && header.ctaHref && (
              <SmartLink
                href={header.ctaHref}
                className="hidden rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-dark sm:inline-flex"
              >
                {t(header.ctaLabel)}
              </SmartLink>
            )}
            {/* 모바일: 메뉴를 열지 않아도 바로 보이는 언어 버튼 */}
            <button
              onClick={openLanguageGate}
              aria-label="Language"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand py-1.5 pl-1.5 pr-2.5 text-[11px] font-extrabold uppercase text-white md:hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={flagUrl(langInfo(lang).flag)} alt="" className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-white/50" />
              {lang}
            </button>
            <button className="p-2 md:hidden" aria-label={t('메뉴 열기')} onClick={() => setMobile((v) => !v)}>
              {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 메가 메뉴 */}
      {mega && hasMega && (
        <div className="absolute inset-x-0 top-full hidden border-b border-black/10 bg-white shadow-xl md:block">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-7" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {header.menu.map((m) => (
              <ul key={m.label + m.href} className="space-y-2.5">
                {m.children.map((c) => (
                  <li key={c.href + c.label}>
                    <SmartLink
                      href={c.href}
                      onClick={() => setMega(false)}
                      className={`text-sm transition-colors hover:text-brand ${
                        pathname === c.href ? 'font-bold text-brand' : 'text-slate-600'
                      }`}
                    >
                      {t(c.label)}
                    </SmartLink>
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
          {header.menu.map((m, i) => (
            <div key={m.label + m.href} className="border-b border-black/5 last:border-0">
              {m.children.length > 0 ? (
                <>
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
                          <SmartLink href={c.href} onClick={() => setMobile(false)} className="block py-2 text-sm text-slate-600">
                            {t(c.label)}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <SmartLink href={m.href} onClick={() => setMobile(false)} className="block py-3.5 text-sm font-bold">
                  {t(m.label)}
                </SmartLink>
              )}
            </div>
          ))}
          <button onClick={() => { setMobile(false); openLanguageGate(); }} className="flex items-center gap-1.5 py-3 text-sm font-bold">
            <Globe className="h-4 w-4" /> {langInfo(lang).name}
          </button>
          <div className="flex flex-wrap gap-x-5 gap-y-2 py-4 text-xs text-slate-500">
            {header.utility.map((l) => (
              <SmartLink key={l.href + l.label} href={l.href} onClick={() => setMobile(false)}>
                {t(l.label)}
              </SmartLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
