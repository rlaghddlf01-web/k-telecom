import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { findSection } from '@/lib/menu';
import { t } from '@/lib/i18n';

interface PageShellProps {
  path: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}

/** 서브 페이지 공통 틀: 헤더 + 타이틀 배너 + 좌측 섹션 메뉴 + 푸터 */
export default function PageShell({ path, title, lead, children }: PageShellProps) {
  const section = findSection(path);
  const showSide = !!section && section.children.length > 1;

  return (
    <>
      <SiteHeader />

      <div className="bg-gradient-to-r from-navy via-[#1b1550] to-[#3b1670] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-white/55">
            <Link href="/" aria-label={t('홈')} className="hover:text-white">
              <Home className="h-3.5 w-3.5" />
            </Link>
            {section && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span>{t(section.label)}</span>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/85">{t(title)}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{t(title)}</h1>
          {lead && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{t(lead)}</p>}
        </div>
      </div>

      <div className={`mx-auto max-w-7xl px-4 py-10 md:py-14 ${showSide ? 'md:grid md:grid-cols-[200px_1fr] md:gap-10' : ''}`}>
        {showSide && section && (
          <aside className="mb-8 md:mb-0">
            <p className="mb-3 text-sm font-black">{t(section.label)}</p>
            <ul className="flex gap-2 overflow-x-auto md:block md:space-y-1">
              {section.children.map((c) => (
                <li key={c.href + c.label} className="shrink-0">
                  <Link
                    href={c.href}
                    className={`block rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                      c.href === path ? 'bg-brand font-bold text-white' : 'bg-soft text-slate-600 hover:text-brand'
                    }`}
                  >
                    {t(c.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <main className="min-w-0">{children}</main>
      </div>

      <SiteFooter />
    </>
  );
}
