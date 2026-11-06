'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PhoneMockup from '@/components/PhoneMockup';
import SmartLink from '@/components/SmartLink';
import { themeOf } from '@/lib/content/themes';
import type { Banner } from '@/lib/content/types';
import { useT } from '@/components/LangProvider';

export default function HeroSlider({ slides }: { slides: Banner[] }) {
  const t = useT();
  const [idx, setIdx] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % count), 6500);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const current = Math.min(idx, count - 1);
  const go = (d: number) => setIdx((i) => (i + d + count) % count);

  return (
    <section className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s) => {
          const theme = themeOf(s.theme);
          return (
            <div key={s.id} className={`relative min-w-full bg-gradient-to-br ${theme.bg} text-white`}>
              {s.image_url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
                </>
              ) : (
                <div
                  className="pointer-events-none absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-3xl"
                  style={{ background: theme.glow }}
                />
              )}

              <div
                className={`relative mx-auto grid min-h-[420px] max-w-7xl items-center gap-4 px-6 md:min-h-[540px] md:px-16 ${
                  s.image_url ? '' : 'md:grid-cols-2'
                }`}
              >
                {!s.image_url && (
                  <div className="relative order-2 flex h-[230px] items-center justify-center md:order-1 md:h-[440px]">
                    <PhoneMockup
                      kind={theme.phones[1].kind}
                      from={theme.phones[1].from}
                      to={theme.phones[1].to}
                      className="absolute left-1/2 h-[200px] -translate-x-[10%] rotate-[10deg] opacity-95 drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)] md:h-[400px]"
                    />
                    <PhoneMockup
                      kind={theme.phones[0].kind}
                      from={theme.phones[0].from}
                      to={theme.phones[0].to}
                      className="absolute left-1/2 h-[220px] -translate-x-[95%] -rotate-[8deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] md:h-[430px]"
                    />
                  </div>
                )}

                <div className={`pt-12 md:pt-0 ${s.image_url ? 'max-w-xl' : 'order-1 md:order-2 md:text-right'}`}>
                  {s.eyebrow && <p className="text-xs font-bold tracking-[0.3em] text-white/60 md:text-sm">{t(s.eyebrow)}</p>}
                  <h1 className="mt-4 whitespace-pre-line text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
                    {t(s.title)}
                  </h1>
                  {s.description && <p className="mt-4 text-sm text-white/70 md:text-base">{t(s.description)}</p>}
                  {s.link_url && s.button_label && (
                    <SmartLink
                      href={s.link_url}
                      className="mt-7 inline-flex rounded-md bg-white px-7 py-3 text-xs font-extrabold tracking-wide text-ink transition-colors hover:bg-brand hover:text-white"
                    >
                      {t(s.button_label)}
                    </SmartLink>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
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
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-4 bg-white/35'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
