import Link from 'next/link';
import PhoneMockup from '@/components/PhoneMockup';
import { Wifi, CardSim } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function PromoBanners() {
  return (
    <section className="grid md:grid-cols-3">
      <Link href="/#products" className="group relative flex min-h-[190px] items-center overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500 px-8 text-white">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{t('스마트폰 할부')}</h3>
          <p className="mt-1 text-sm text-white/90">{t('외국인등록증 기반 24개월')}</p>
          <span className="mt-4 inline-flex rounded-md bg-white px-4 py-1.5 text-xs font-extrabold text-ink">{t('자세히 보기')}</span>
        </div>
        <PhoneMockup kind="island" from="#1e1b4b" to="#fb923c" className="absolute -right-2 -bottom-10 h-56 rotate-[14deg] transition-transform group-hover:rotate-[8deg]" />
      </Link>

      <Link href="/#products" className="group relative flex min-h-[190px] items-center overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 px-8 text-white">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{t('알뜰폰 요금제')}</h3>
          <p className="mt-1 text-sm text-white/90">{t('월 1~2만원대 실속형')}</p>
          <span className="mt-4 inline-flex rounded-md bg-white px-4 py-1.5 text-xs font-extrabold text-ink">{t('자세히 보기')}</span>
        </div>
        <CardSim className="absolute -right-4 -bottom-6 h-44 w-44 rotate-[-12deg] text-white/20 transition-transform group-hover:rotate-0" strokeWidth={1.2} />
      </Link>

      <Link href="/#products" className="group relative flex min-h-[190px] items-center overflow-hidden bg-gradient-to-br from-rose-600 to-pink-700 px-8 text-white">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{t('원룸 인터넷+TV')}</h3>
          <p className="mt-1 text-sm text-white/90">{t('1분 신청 · 방문 설치')}</p>
          <span className="mt-4 inline-flex rounded-md bg-white px-4 py-1.5 text-xs font-extrabold text-ink">{t('자세히 보기')}</span>
        </div>
        <Wifi className="absolute -right-4 -bottom-6 h-44 w-44 text-white/20 transition-transform group-hover:scale-110" strokeWidth={1.2} />
      </Link>
    </section>
  );
}
