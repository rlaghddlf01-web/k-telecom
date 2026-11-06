import Link from '@/components/LocaleLink';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import { getNotices } from '@/lib/content/load';
import { t, withLang } from '@/lib/i18n';

export const generateMetadata = pageMeta('공지사항 | K-Telecom');

async function NoticePage() {
  const notices = await getNotices();

  return (
    <PageShell path="/support/notice" managed title="공지사항">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
        <div className="hidden grid-cols-[70px_1fr_120px] bg-soft px-5 py-3 text-xs font-bold text-slate-500 sm:grid">
          <span>{t('번호')}</span>
          <span>{t('제목')}</span>
          <span className="text-right">{t('등록일')}</span>
        </div>
        <ul className="divide-y divide-black/5">
          {notices.map((n, i) => (
            <li key={n.id}>
              <Link
                href={`/support/notice/${n.id}`}
                className="grid grid-cols-1 gap-1 px-5 py-4 text-sm transition-colors hover:bg-soft sm:grid-cols-[70px_1fr_120px] sm:gap-0"
              >
                <span className="hidden text-slate-400 sm:block">{notices.length - i}</span>
                <span className="font-bold">{t(n.title)}</span>
                <span className="text-xs text-slate-400 sm:text-right">{n.date}</span>
              </Link>
            </li>
          ))}
          {notices.length === 0 && <li className="px-5 py-14 text-center text-sm text-slate-400">{t('등록된 공지가 없습니다.')}</li>}
        </ul>
      </div>
    </PageShell>
  );
}

export default withLang(NoticePage);
