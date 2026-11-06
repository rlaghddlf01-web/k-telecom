import Link from '@/components/LocaleLink';
import { Headset } from 'lucide-react';
import type { Post } from '@/lib/boards';
import type { Faq } from '@/lib/faq';
import { ht } from '@/lib/content/homeText';

interface HomeSupportProps {
  phone: string;
  notices: Post[];
  faqs: Faq[];
}

export default function HomeSupport({ phone, notices, faqs }: HomeSupportProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl bg-soft p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black">{ht('공지사항')}</h2>
            <Link href="/support/notice" className="text-xs font-bold text-slate-500 hover:text-brand">{ht('더보기')} +</Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {notices.slice(0, 5).map((n) => (
              <li key={n.id}>
                <Link href={`/support/notice/${n.id}`} className="flex items-center justify-between gap-3 hover:text-brand">
                  <span className="truncate font-semibold">{ht(n.title)}</span>
                  <span className="shrink-0 text-xs text-slate-400">{n.date.slice(5)}</span>
                </Link>
              </li>
            ))}
            {notices.length === 0 && <li className="text-xs text-slate-400">{ht('등록된 공지가 없습니다.')}</li>}
          </ul>
        </div>

        <div className="rounded-3xl bg-navy p-6 text-white">
          <h2 className="flex items-center gap-2 text-base font-black">
            <Headset className="h-5 w-5 text-brand" /> {ht('고객센터')}
          </h2>
          {phone && (
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mt-4 block text-3xl font-black tracking-tight">
              {phone}
            </a>
          )}
          <p className="mt-2 text-xs text-white/55">{ht('전화 또는 1:1 상담문의로 편하게 문의하세요.')}</p>
          <Link href="/support/inquiry" className="mt-6 inline-flex rounded-full bg-brand px-6 py-2.5 text-xs font-bold hover:bg-brand-dark">
            {ht('1:1 상담문의')}
          </Link>
        </div>

        <div className="rounded-3xl bg-soft p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black">{ht('자주 묻는 질문')}</h2>
            <Link href="/support/faq" className="text-xs font-bold text-slate-500 hover:text-brand">{ht('더보기')} +</Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {faqs.slice(0, 5).map((f) => (
              <li key={f.q}>
                <Link href="/support/faq" className="block truncate font-semibold hover:text-brand">
                  <span className="mr-1.5 text-brand">Q</span>
                  {ht(f.q)}
                </Link>
              </li>
            ))}
            {faqs.length === 0 && <li className="text-xs text-slate-400">{ht('등록된 질문이 없습니다.')}</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
