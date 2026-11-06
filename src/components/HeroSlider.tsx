'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PhoneMockup, { type PhoneKind } from '@/components/PhoneMockup';
import { t } from '@/lib/i18n';

interface Slide {
  eyebrow: string;
  title: string;
  desc: string;
  cta: { label: string; href: string };
  bg: string;
  glow: string;
  phones: { kind: PhoneKind; from: string; to: string }[];
}

const SLIDES: Slide[] = [
  {
    eyebrow: '외국인 맞춤 통신',
    title: '내 나라 말로\n한 번에 개통',
    desc: '스마트폰 · 알뜰폰 · 인터넷 · IPTV를 하나의 앱에서',
    cta: { label: '상품 보기', href: '/#products' },
    bg: 'from-[#05060d] via-[#0d0b24] to-[#1a0f3d]',
    glow: 'rgba(109,93,252,0.55)',
    phones: [
      { kind: 'island', from: '#6d5dfc', to: '#e8174f' },
      { kind: 'back', from: '#38bdf8', to: '#6366f1' },
    ],
  },
  {
    eyebrow: '초기비용 0원',
    title: '기기값 0원\n24개월 분할',
    desc: '외국인등록증만 있으면 신용카드 없이 단말 할부 가능',
    cta: { label: '이용 방법', href: '/#process' },
    bg: 'from-[#030b14] via-[#06223a] to-[#0a3b57]',
    glow: 'rgba(14,165,233,0.5)',
    phones: [
      { kind: 'punch', from: '#34d399', to: '#0ea5e9' },
      { kind: 'back', from: '#1e293b', to: '#38bdf8' },
    ],
  },
  {
    eyebrow: '파트너 모집',
    title: '통신 제휴사를\n찾고 있습니다',
    desc: '마케팅비 없이 외국인 신규 가입자를 연결해 드립니다',
    cta: { label: '제휴 신청하기', href: '/partnership' },
    bg: 'from-[#14040c] via-[#3a0a1f] to-[#6a0f33]',
    glow: 'rgba(232,23,79,0.5)',
    phones: [
      { kind: 'island', from: '#f472b6', to: '#f59e0b' },
      { kind: 'back', from: '#a855f7', to: '#e8174f' },
    ],
  },
];

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(timer);
  }, []);

  const go = (d: number) => setIdx((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {SLIDES.map((s) => (
          <div key={s.title} className={`relative min-w-full bg-gradient-to-br ${s.bg} text-white`}>
            <div
              className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: s.glow }}
            />
            <div className="relative mx-auto grid min-h-[420px] max-w-7xl items-center gap-4 px-6 md:min-h-[540px] md:grid-cols-2 md:px-16">
              <div className="relative order-2 flex h-[230px] items-center justify-center md:order-1 md:h-[440px]">
                <PhoneMockup
                  kind={s.phones[1].kind}
                  from={s.phones[1].from}
                  to={s.phones[1].to}
                  className="absolute left-1/2 h-[200px] -translate-x-[10%] rotate-[10deg] opacity-95 drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)] md:h-[400px]"
                />
                <PhoneMockup
                  kind={s.phones[0].kind}
                  from={s.phones[0].from}
                  to={s.phones[0].to}
                  className="absolute left-1/2 h-[220px] -translate-x-[95%] -rotate-[8deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] md:h-[430px]"
                />
              </div>

              <div className="order-1 pt-12 md:order-2 md:pt-0 md:text-right">
                <p className="text-xs font-bold tracking-[0.3em] text-white/60 md:text-sm">{t(s.eyebrow)}</p>
                <h1 className="mt-4 whitespace-pre-line text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
                  {t(s.title)}
                </h1>
                <p className="mt-4 text-sm text-white/70 md:text-base">{t(s.desc)}</p>
                <Link
                  href={s.cta.href}
                  className="mt-7 inline-flex rounded-md bg-white px-7 py-3 text-xs font-extrabold tracking-wide text-ink transition-colors hover:bg-brand hover:text-white"
                >
                  {t(s.cta.label)}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label={t('이전 슬라이드')}
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur hover:bg-white/25"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label={t('다음 슬라이드')}
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur hover:bg-white/25"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            aria-label={`${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-white' : 'w-4 bg-white/35'}`}
          />
        ))}
      </div>
    </section>
  );
}
