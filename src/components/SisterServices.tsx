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
      bg: 'from-[#1e3a6e] to-[#2f5bb0]',
      btn: 'text-[#1e3a6e]',
    },
    {
      id: 'market',
      href: marketHref,
      Icon: ShoppingBag,
      name: 'KTRS Market',
      eyebrow: ht('중고거래 · 무빙세일'),
      desc: ht('중고거래·무빙세일 장터에서 필요한 물건을 가까이서 구해 보세요'),
      cta: ht('장터 둘러보기'),
      bg: 'from-[#2a2118] to-[#8a6414]',
      btn: 'text-[#6b4d0c]',
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 md:pt-14">
      <h2 className="mb-4 text-center text-sm font-bold text-gray-500 md:text-base">{ht('한국 생활에 필요한 서비스를 더 만나 보세요')}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {cards.map(({ id, href, Icon, name, eyebrow, desc, cta, bg, btn }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener"
            className={`group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-r ${bg} p-4 text-white shadow-[0_14px_30px_-16px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-0.5 md:gap-4 md:p-6`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 md:h-16 md:w-16">
              <Icon className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.7} />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-white/70">{eyebrow}</span>
              <span className="mt-0.5 block text-sm font-extrabold leading-tight md:text-lg">{name}</span>
              <span className="mt-1 block text-xs leading-snug text-white/85 md:text-[13px]">{desc}</span>
            </span>
            <span className={`hidden shrink-0 items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold sm:inline-flex ${btn}`}>
              {cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <ArrowRight aria-label={cta} className="h-5 w-5 shrink-0 sm:hidden" />

          </a>
        ))}
      </div>
    </section>
  );
}
