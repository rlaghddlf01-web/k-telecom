import Link from 'next/link';
import { NEWS } from '@/lib/site';
import { t } from '@/lib/i18n';

export default function NewsSection() {
  const [first, ...rest] = NEWS;

  return (
    <section id="news" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      <div className="flex items-end justify-between">
        <h2 className="section-title">{t('최신 소식')}</h2>
        <Link href="/support/notice" className="text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-brand">
          {t('전체 보기')}
        </Link>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Link
          href="/support/notice"
          className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-brand p-7 text-white transition-transform hover:-translate-y-0.5"
        >
          <span className="absolute left-5 top-5 rounded-xl bg-white px-3 py-2 text-center text-xs font-black leading-tight text-ink">
            {first.date}
          </span>
          <h3 className="text-xl font-black leading-snug">{t(first.title)}</h3>
          <p className="mt-2 text-sm text-white/85">{t(first.desc)}</p>
        </Link>

        <ul className="flex flex-col gap-3 rounded-3xl bg-navy p-5 text-white">
          {rest.map((n) => (
            <li key={n.title}>
              <Link href="/support/notice" className="block rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                <p className="text-sm font-bold">{t(n.title)}</p>
                <p className="mt-1 text-xs text-white/60">{t(n.desc)}</p>
                <p className="mt-2 text-[11px] text-white/40">{n.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
