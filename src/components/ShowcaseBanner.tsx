import Link from 'next/link';
import PhoneMockup from '@/components/PhoneMockup';
import { t } from '@/lib/i18n';

export default function ShowcaseBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06070f] via-[#15103a] to-[#3b1670] px-8 py-12 text-white md:px-16">
        <div className="absolute right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-fuchsia-500/40 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-white/55">{t('외국인 전용 단말 할부')}</p>
            <h2 className="mt-3 whitespace-pre-line text-3xl font-black leading-tight md:text-4xl">
              {t('신용카드 없이도\n최신 폰을 내 손에')}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {t('외국인등록증 기반으로 24개월 통신요금과 합산 청구합니다. 초기비용 부담 없이 시작하세요.')}
            </p>
            <Link href="/phones/installment" className="mt-7 inline-flex rounded-md bg-white px-6 py-3 text-xs font-extrabold text-ink hover:bg-brand hover:text-white transition-colors">
              {t('할부 안내 보기')}
            </Link>
          </div>
          <div className="relative flex h-72 items-center justify-center md:h-96">
            <PhoneMockup kind="back" from="#6d5dfc" to="#e8174f" className="absolute left-[8%] h-64 -rotate-[10deg] drop-shadow-[0_28px_30px_rgba(0,0,0,0.55)] md:h-80" />
            <PhoneMockup kind="island" from="#0ea5e9" to="#6d5dfc" className="relative z-10 h-72 rotate-[6deg] drop-shadow-[0_28px_30px_rgba(0,0,0,0.55)] md:h-96" />
            <PhoneMockup kind="punch" from="#f59e0b" to="#e8174f" className="absolute right-[6%] h-60 rotate-[16deg] drop-shadow-[0_28px_30px_rgba(0,0,0,0.55)] md:h-72" />
          </div>
        </div>
      </div>
    </section>
  );
}
