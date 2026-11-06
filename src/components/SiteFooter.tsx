import Link from 'next/link';
import SmartLink from '@/components/SmartLink';
import { getSiteSettings } from '@/lib/content/load';
import { t } from '@/lib/i18n';

/** 푸터: 내용은 관리자의 [헤더·푸터]에서 수정 */
export default async function SiteFooter() {
  const { header, footer } = await getSiteSettings();
  const c = footer.company;

  return (
    <footer className="bg-[#070b18] text-white/65">
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10 pb-6 text-sm">
          {footer.links.map((l) => (
            <li key={l.href + l.label}>
              <SmartLink href={l.href} className={l.href === '/privacy' ? 'font-bold text-white' : 'hover:text-white'}>
                {l.label}
              </SmartLink>
            </li>
          ))}
          {footer.publicLinks.map((l) => (
            <li key={l.href + l.label}>
              <SmartLink href={l.href} className="hover:text-white">
                {l.label}
              </SmartLink>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 py-8 text-xs leading-relaxed md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xl font-black text-brand">{header.logoText}</p>
            {footer.description && <p className="mt-2">{footer.description}</p>}
            <p className="mt-3">
              {c.name && <>{t('상호')}: {c.name}</>}
              {c.ceo && <> · {t('대표')}: {c.ceo}</>}
            </p>
            {c.address && <p>{t('주소')}: {c.address}</p>}
            {(c.bizNumber || c.salesNumber) && (
              <p>
                {c.bizNumber && <>{t('사업자등록번호')}: {c.bizNumber}</>}
                {c.bizNumber && c.salesNumber && ' · '}
                {c.salesNumber && <>{t('통신판매업')}: {c.salesNumber}</>}
              </p>
            )}
            <p>
              {c.phone && <>{t('전화')}: {c.phone}</>}
              {c.phone && c.email && ' · '}
              {c.email && <>{t('이메일')}: {c.email}</>}
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-sm font-bold text-white">{t('고객센터')}</p>
            {c.phone && <p className="mt-1 text-2xl font-black text-white">{c.phone}</p>}
            <Link href="/support/inquiry" className="mt-3 inline-flex rounded-full border border-white/30 px-4 py-2 font-bold text-white hover:bg-white/10">
              {t('1:1 상담문의')}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/35">
        {footer.copyright || `© ${new Date().getFullYear()} ${c.name}. All Rights Reserved.`}
      </div>
    </footer>
  );
}
