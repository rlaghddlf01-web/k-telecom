import Link from 'next/link';
import DealCountdown from '@/components/DealCountdown';
import ProductImage from '@/components/ProductImage';
import PhoneMockup from '@/components/PhoneMockup';
import { PHONES } from '@/lib/phones';
import { t } from '@/lib/i18n';

const [left, , right] = [PHONES[0], PHONES[1], PHONES[3]];

function DealCard({ phone }: { phone: (typeof PHONES)[number] }) {
  return (
    <Link
      href={`/phones/item/${phone.id}`}
      className="relative flex flex-col items-center rounded-[1.75rem] bg-white p-6 text-center shadow-[0_20px_50px_-30px_rgba(15,20,36,0.45)] ring-1 ring-black/5 transition-shadow hover:shadow-[0_24px_50px_-24px_rgba(15,20,36,0.55)]"
    >
      {phone.badge && (
        <span className="absolute left-5 top-5 rounded-md bg-brand px-2 py-1 text-[10px] font-extrabold text-white">
          {t(phone.badge)}
        </span>
      )}
      <div className="flex h-60 items-center justify-center">
        <ProductImage phone={phone} className="h-56 drop-shadow-[0_22px_22px_rgba(15,20,36,0.3)]" />
      </div>
      <p className="mt-4 text-[11px] font-semibold text-slate-400">{t(phone.tag)}</p>
      <h3 className="mt-1 text-sm font-bold">{t(phone.title)}</h3>
      <p className="mt-2 text-xl font-black text-brand">{t(phone.price)}</p>
      <p className="mt-1 text-xs text-slate-500">{t(phone.note)}</p>
      <div className="mt-5">
        <DealCountdown />
      </div>
    </Link>
  );
}

export default function TodayDeals() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <h2 className="section-title text-center">{t('이달의 추천 결합')}</h2>
      <div className="mt-10 grid items-stretch gap-6 md:grid-cols-[1fr_1.05fr_1fr]">
        <DealCard phone={left} />

        <article className="relative flex flex-col items-center overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-orange-400 via-rose-500 to-fuchsia-600 px-6 pb-7 pt-8 text-center text-white">
          <p className="text-[11px] font-bold tracking-[0.25em] text-white/85">{t('3중 결합 혜택')}</p>
          <h3 className="mt-2 text-2xl font-black leading-snug">{t('단말 + 요금제 + 인터넷')}</h3>
          <div className="relative mt-4 flex h-56 w-full items-end justify-center">
            <div className="absolute bottom-0 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <PhoneMockup kind="island" from="#1e1b4b" to="#e8174f" className="relative h-60 drop-shadow-[0_26px_26px_rgba(0,0,0,0.4)]" />
          </div>
          <p className="mt-4 text-sm text-white/90">{t('결합할수록 월 납부액이 줄어듭니다')}</p>
          <div className="mt-5 flex gap-3">
            <Link href="/phones" className="rounded-md bg-white px-5 py-2.5 text-xs font-extrabold text-brand">
              {t('상품 보기')}
            </Link>
            <Link href="/support/inquiry" className="rounded-md border border-white/70 px-5 py-2.5 text-xs font-extrabold">
              {t('결합 문의')}
            </Link>
          </div>
        </article>

        <DealCard phone={right} />
      </div>
    </section>
  );
}
