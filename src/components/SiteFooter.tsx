import Link from 'next/link';
import { COMPANY } from '@/lib/site';
import { FOOTER_LINKS, PUBLIC_LINKS } from '@/lib/menu';
import { t } from '@/lib/i18n';

export default function SiteFooter() {
  return (
    <footer className="bg-[#070b18] text-white/65">
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10 pb-6 text-sm">
          {FOOTER_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={l.href === '/privacy' ? 'font-bold text-white' : 'hover:text-white'}>
                {t(l.label)}
              </Link>
            </li>
          ))}
          {PUBLIC_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {t(l.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 py-8 text-xs leading-relaxed md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xl font-black text-brand">K-Telecom</p>
            <p className="mt-3">
              {t('상호')}: {COMPANY.name} · {t('대표')}: {COMPANY.ceo}
            </p>
            <p>
              {t('주소')}: {COMPANY.address}
            </p>
            <p>
              {t('전화')}: {COMPANY.phone} · {t('이메일')}: {COMPANY.email}
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-sm font-bold text-white">{t('고객센터')}</p>
            <p className="mt-1 text-2xl font-black text-white">{COMPANY.phone}</p>
            <Link href="/support/inquiry" className="mt-3 inline-flex rounded-full border border-white/30 px-4 py-2 font-bold text-white hover:bg-white/10">
              {t('1:1 상담문의')}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/35">
        © {new Date().getFullYear()} {COMPANY.name}. All Rights Reserved.
      </div>
    </footer>
  );
}
