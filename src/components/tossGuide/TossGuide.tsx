'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TOSS_CHAPTERS, TOSS_GUIDE_STEPS } from '@/lib/guides/toss/tossGuideData';
import { cn } from '@/lib/cn';
import { TossSlideFrame } from './TossSlideFrame';
import { useIsRtl, useTossText } from './useTossText';

/**
 * 토스 인증서 만들기 안내: 준비물 → 슬라이드(한 번에 한 장) → 챕터 바로가기.
 * 이지텍스의 토스 안내(발급 부분)를 가져온 것이다. 슬라이드 설명은 15개 언어 문구(tossGuideTexts.ts)를 쓴다.
 */
export default function TossGuide() {
  const tt = useTossText();
  const rtl = useIsRtl();
  const [current, setCurrent] = useState(0);
  const slides = TOSS_GUIDE_STEPS;
  const slide = slides[current];
  const go = (d: number) => setCurrent((c) => Math.min(slides.length - 1, Math.max(0, c + d)));
  const chapter = TOSS_CHAPTERS[slide.chapter];

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className="space-y-8">
      {/* 준비물 */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10">
        <h2 className="text-lg font-black">{tt('prepTitle')}</h2>
        <p className="mt-1 text-sm text-slate-600">{tt('prepIntro')}</p>
        <ul className="mt-3 space-y-2 text-sm font-bold">
          {(['prep1', 'prep2', 'prep3'] as const).map((k) => (
            <li key={k} className="flex items-start gap-2">
              <span className="mt-0.5 text-[#0064FF]">✔</span>
              <span>{tt(k)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-800 ring-1 ring-amber-200">{tt('accountYesNote')}</p>
        <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">{tt('accountNoMsg')}</p>
      </section>

      {/* 챕터 바로가기 */}
      <div className="flex flex-wrap gap-2">
        {TOSS_CHAPTERS.map((c, i) => {
          const start = c.start;
          return (
            <button
              key={c.title}
              type="button"
              onClick={() => setCurrent(start)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-extrabold transition-colors',
                slide.chapter === i ? 'bg-[#0064FF] text-white' : 'bg-soft text-slate-600 hover:text-[#0064FF]',
              )}
            >
              {c.icon} {tt(c.title)}
            </button>
          );
        })}
      </div>

      {/* 슬라이드 */}
      <section className="rounded-3xl bg-slate-50/70 p-4 shadow-md ring-1 ring-slate-200/60 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 rounded-full bg-[#0064FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">Toss</span>
          <span className="text-xs font-black text-slate-600">
            {current + 1} / {slides.length}
          </span>
        </div>

        <div className="mt-4 flex justify-center">
          <TossSlideFrame key={current} slide={slide} index={current} size="md" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={current === 0}
            aria-label="previous"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>
          <span className="min-w-[4.5rem] text-center text-xs font-black text-slate-600">{current + 1} / {slides.length}</span>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={current === slides.length - 1}
            aria-label="next"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0064FF] text-white shadow disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        </div>

        <div className="mt-5 text-center">
          {chapter && <p className="text-[11px] font-black text-[#0064FF]">{chapter.icon} {tt(chapter.title)}</p>}
          <h3 className="mt-1 text-base font-black">{tt(slide.title)}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{tt(slide.body)}</p>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              className={cn('h-2 rounded-full transition-all duration-300', current === idx ? 'w-5 bg-slate-800' : 'w-2 bg-slate-300')}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
