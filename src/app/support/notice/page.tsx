import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { NOTICES } from '@/lib/boards';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('공지사항 | K-Telecom'),
};

export default function NoticePage() {
  return (
    <PageShell path="/support/notice" title="공지사항">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
        <div className="hidden grid-cols-[70px_1fr_120px] bg-soft px-5 py-3 text-xs font-bold text-slate-500 sm:grid">
          <span>{t('번호')}</span>
          <span>{t('제목')}</span>
          <span className="text-right">{t('등록일')}</span>
        </div>
        <ul className="divide-y divide-black/5">
          {NOTICES.map((n, i) => (
            <li key={n.id}>
              <Link
                href={`/support/notice/${n.id}`}
                className="grid grid-cols-1 gap-1 px-5 py-4 text-sm transition-colors hover:bg-soft sm:grid-cols-[70px_1fr_120px] sm:gap-0"
              >
                <span className="hidden text-slate-400 sm:block">{NOTICES.length - i}</span>
                <span className="font-bold">{t(n.title)}</span>
                <span className="text-xs text-slate-400 sm:text-right">{n.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
