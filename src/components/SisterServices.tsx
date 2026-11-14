import { ArrowRight, Receipt, ShoppingBag } from 'lucide-react';
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
  const taxHref = `https://ktrs-service.vercel.app/welcome?lang=${taxLang}&${utm('tax')}`;
  const marketHref = `https://ktrs-market.vercel.app${lang === DEFAULT_LANG ? '/' : `/${lang}`}?${utm('market')}`;

  const cards = [
    {
      id: 'tax',
      href: taxHref,
      Icon: Receipt,
      name: 'Korea Tax Refund Service',
      eyebrow: ht('세금 환급'),
      desc: ht('한국에서 낸 세금, 돌려받을 수 있는지 내 나라 말로 확인해 보세요'),
      cta: ht('환급 알아보기'),
      tile: 'from-[#3b82f6] to-[#5b4fe0]',
      chip: 'bg-[#eef2ff] text-[#4338ca]',
      btn: 'from-[#3b82f6] to-[#5b4fe0]',
      glow: 'bg-[#5b4fe0]/10',
    },
    {
      id: 'market',
      href: marketHref,
      Icon: ShoppingBag,
      name: 'KTRS Market',
      eyebrow: ht('중고거래 · 무빙세일'),
      desc: ht('중고거래·무빙세일 장터에서 필요한 물건을 가까이서 구해 보세요'),
      cta: ht('장터 둘러보기'),
      tile: 'from-[#fbbf24] to-[#f97316]',
      chip: 'bg-[#fff7e6] text-[#b45309]',
      btn: 'from-[#fbbf24] to-[#f97316]',
      glow: 'bg-[#f97316]/10',
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 md:pt-14">
      <h2 className="mb-4 text-center text-sm font-bold text-gray-500 md:text-base">{ht('한국 생활에 필요한 서비스를 더 만나 보세요')}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {cards.map(({ id, href, Icon, name, eyebrow, desc, cta, tile, chip, btn, glow }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener"
            className="group relative flex min-w-0 items-center gap-4 overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white p-4 shadow-[0_12px_32px_-18px_rgba(15,20,36,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-18px_rgba(15,20,36,0.45)] md:p-5"
          >
            <span aria-hidden="true" className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${glow} blur-2xl`} />
            <span className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tile} text-white shadow-[0_10px_20px_-8px_rgba(0,0,0,0.4)] md:h-16 md:w-16`}>
              <Icon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.8} />
            </span>
            <span className="relative min-w-0 flex-1 text-left">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${chip}`}>{eyebrow}</span>
              <span className="mt-1.5 block text-[15px] font-extrabold leading-tight tracking-tight text-ink md:text-lg">{name}</span>
              <span className="mt-1 block text-xs leading-snug text-gray-500 md:text-[13px]">{desc}</span>
            </span>
            <span className={`relative hidden shrink-0 items-center gap-1 rounded-full bg-gradient-to-r ${btn} px-4 py-2 text-xs font-bold text-white shadow-[0_8px_16px_-8px_rgba(0,0,0,0.45)] sm:inline-flex`}>
              {cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span aria-label={cta} className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${btn} text-white sm:hidden`}>
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
