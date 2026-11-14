import {
  ArrowRight,
  Receipt,
  ShoppingBag,
  Scale,
  Clock,
  DollarSign,
  ShieldCheck,
  MessageCircle,
  Plane,
  Sparkles,
} from 'lucide-react';
import { ht } from '@/lib/content/homeText';
import { getLang } from '@/lib/i18n';
import { DEFAULT_LANG, type Lang } from '@/lib/langs';

// 같은 KTRS 가족 서비스(세금 환급 · 중고거래 장터)로 이어 주는 배너.
// 상대 서비스가 지원하지 않는 언어(세금 환급: 일본어·러시아어)는 영어로 연결한다.
const TAX_LANGS: readonly Lang[] = ['ko', 'en', 'vi', 'zh', 'th', 'uz', 'km', 'mn', 'ne', 'id', 'my', 'si', 'kk', 'bn', 'ur'];

function utm(id: string) {
  return `utm_source=k-telecom&utm_medium=home-banner&utm_campaign=cross-${id}`;
}

export default function SisterServices() {
  const lang = getLang();
  const taxLang: Lang = TAX_LANGS.includes(lang) ? lang : 'en';
  // 현재 K-Telecom 언어(예: /vi -> 베트남어) 그대로 이지택스 메인(/?lang=vi)과 K-Market(/vi?lang=vi)에 직행 연결
  const taxHref = `https://ktrs-service.vercel.app/?lang=${taxLang}&${utm('tax')}`;
  const marketHref = `https://ktrs-market.vercel.app${lang === DEFAULT_LANG ? '/?lang=ko' : `/${lang}?lang=${lang}`}&${utm('market')}`;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 md:pt-14">
      <div className="mb-5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef2ff] px-3 py-1 text-[11px] font-extrabold tracking-wide text-[#5b4fe0]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{ht('KTRS 외국인 생활 필수 원스톱 패밀리 서비스')}</span>
        </span>
        <h2 className="mt-2 text-lg font-extrabold tracking-tight text-ink md:text-xl">
          {ht('한국 생활에 필요한 서비스를 더 만나 보세요')}
        </h2>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5">
        {/* 1. 좌측: KTRS 세금 환급 (Korea Tax Refund Service) — K-Telecom 화이트 럭셔리 카드 */}
        <a
          href={taxHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,20,36,0.42)] ring-1 ring-black/6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_-24px_rgba(91,79,224,0.32)] hover:ring-[#5b4fe0]/30 md:p-6"
        >
          {/* 상단 포인트 라인 & 은은한 글로우 */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#3b82f6] via-[#5b4fe0] to-[#7a5cff]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#5b4fe0]/8 blur-2xl"
          />

          <div>
            {/* 상단 헤더: 아이콘 타일 + 서비스명 & 법적근거 배지 */}
            <div className="flex items-start gap-3.5">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#5b4fe0] text-white shadow-[0_10px_22px_-8px_rgba(91,79,224,0.55)]">
                <Receipt className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ff] px-2.5 py-0.5 text-[11px] font-extrabold text-[#4338ca]">
                    {ht('세금 환급')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200/80">
                    <Scale className="h-3 w-3 text-amber-600" />
                    <span>{ht('[5년간 최대 1,000만원]')}</span>
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold tracking-tight text-slate-400">
                  Korea Tax Refund Service
                </p>
              </div>
            </div>

            {/* 메인 타이틀 & 보충 설명 */}
            <div className="mt-4 text-left">
              <h3 className="text-[17px] font-black leading-snug tracking-tight text-ink md:text-lg">
                {ht('지나치기 쉬운 세금 환급,')}{' '}
                <span className="text-[#5b4fe0]">{ht('30초 무료 조회')}</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 md:text-[13px]">
                {ht('한국에서 일하며 낸 세금, 외국인 근로자도 평균 184만원 돌려받습니다. 내 나라 말로 지금 바로 확인해 보세요.')}
              </p>
            </div>

            {/* 3대 핵심 혜택 칩 (K-Telecom 소프트 필 스타일) */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-slate-700">
                <Clock className="h-3 w-3 text-[#5b4fe0]" />
                <span>{ht('소요시간 단 30초')}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-slate-700">
                <DollarSign className="h-3 w-3 text-[#5b4fe0]" />
                <span>{ht('최대 1,000만원 수령')}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>{ht('선결제 0원 (100% 후불제)')}</span>
              </span>
            </div>
          </div>

          {/* 하단 CTA 바 */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
            <span className="text-[11px] font-semibold text-slate-400 line-clamp-1">
              {ht('대한민국 국세청 조세특례제한법 제30조 외국인 법적 권리')}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#5b4fe0] px-4 py-2 text-xs font-extrabold text-white shadow-[0_8px_18px_-6px_rgba(91,79,224,0.6)] transition-transform group-hover:scale-[1.02]">
              <span>{ht('환급 알아보기')}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </a>

        {/* 2. 우측: KTRS Market (중고거래 · 무빙세일) — K-Telecom 화이트 럭셔리 카드 */}
        <a
          href={marketHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,20,36,0.42)] ring-1 ring-black/6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_-24px_rgba(232,23,79,0.28)] hover:ring-brand/30 md:p-6"
        >
          {/* 상단 포인트 라인 & 은은한 글로우 */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[#e8174f]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#f97316]/8 blur-2xl"
          />

          <div>
            {/* 상단 헤더: 아이콘 타일 + 서비스명 & 특가 배지 */}
            <div className="flex items-start gap-3.5">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbbf24] via-[#f97316] to-[#e8174f] text-white shadow-[0_10px_22px_-8px_rgba(249,115,22,0.55)]">
                <ShoppingBag className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7e6] px-2.5 py-0.5 text-[11px] font-extrabold text-[#b45309]">
                    {ht('중고거래 · 무빙세일')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-brand ring-1 ring-rose-200/80">
                    <Plane className="h-3 w-3 text-brand" />
                    <span>{ht('[가전·가구·자전거·아이폰]')}</span>
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold tracking-tight text-slate-400">
                  KTRS Market
                </p>
              </div>
            </div>

            {/* 메인 타이틀 & 보충 설명 */}
            <div className="mt-4 text-left">
              <h3 className="text-[17px] font-black leading-snug tracking-tight text-ink md:text-lg">
                {ht('귀국 무빙세일 최대 85% 특가!')}{' '}
                <span className="text-brand">{ht('내 주변 직거래')}</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 md:text-[13px]">
                {ht('한국어를 못해도 OK! 18개국어 AI 실시간 번역 채팅으로 우리 공단·기숙사 앞에서 안전하게 중고 물품을 거래하세요.')}
              </p>
            </div>

            {/* 3대 핵심 혜택 칩 (K-Telecom 소프트 필 스타일) */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-slate-700">
                <MessageCircle className="h-3 w-3 text-brand" />
                <span>{ht('18개국어 AI 번역채팅')}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-slate-700">
                <Plane className="h-3 w-3 text-orange-500" />
                <span>{ht('귀국 무빙세일·0원 나눔')}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
                <ShieldCheck className="h-3 w-3 text-sky-600" />
                <span>{ht('수수료 0원 안심직거래')}</span>
              </span>
            </div>
          </div>

          {/* 하단 CTA 바 */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
            <span className="text-[11px] font-semibold text-slate-400 line-clamp-1">
              {ht('KTRS Market · 외국인 전용 18개국어 안심 직거래 장터')}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f97316] to-[#e8174f] px-4 py-2 text-xs font-extrabold text-white shadow-[0_8px_18px_-6px_rgba(232,23,79,0.55)] transition-transform group-hover:scale-[1.02]">
              <span>{ht('장터 둘러보기')}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
