import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { t } from '@/lib/i18n';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-6xl font-black text-brand">404</p>
        <h1 className="mt-4 text-2xl font-black">{t('페이지를 찾을 수 없습니다')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('주소가 바뀌었거나 삭제된 페이지입니다.')}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-brand px-7 py-3 text-sm font-bold text-white hover:bg-brand-dark">
            {t('홈으로')}
          </Link>
          <Link href="/support/inquiry" className="rounded-full border border-black/15 px-7 py-3 text-sm font-bold hover:border-brand hover:text-brand">
            {t('1:1 상담문의')}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
