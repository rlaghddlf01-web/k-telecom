'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { KAKAO_GUIDE, PASS_GUIDE } from '@/lib/guides/cert/certGuideData';
import { CERT_NOTE, CERT_OTHER_GUIDE, CERT_PREP, CERT_PREP_TITLE, CERT_TOSS_LINK } from '@/lib/guides/cert/certGuideStrings';
import { cn } from '@/lib/cn';
import { useT } from '@/components/LangProvider';
import { CertSlideFrame, KAKAO_THEME, PASS_THEME } from './CertSlideFrame';
import { useCertText, useIsRtl } from './useCertText';

export type CertKind = 'kakao' | 'pass';

/** 카카오톡·PASS 인증서 만들기 안내: 준비물 → 슬라이드(한 번에 한 장) → 챕터 바로가기. 이지텍스 안내(발급 부분)를 가져온 것이다 */
export default function CertGuide({ kind }: { kind: CertKind }) {
  const tc = useCertText();
  const t = useT();
  const rtl = useIsRtl();
  const guide = kind === 'kakao' ? KAKAO_GUIDE : PASS_GUIDE;
  const theme = kind === 'kakao' ? KAKAO_THEME : PASS_THEME;
  const name = kind === 'kakao' ? 'KakaoTalk' : 'PASS';
  const [current, setCurrent] = useState(0);
  const slides = guide.slides;
  const slide = slides[current];
  const go = (d: number) => setCurrent((c) => Math.min(slides.length - 1, Math.max(0, c + d)));
  let chapterIdx = 0;
  guide.chapters.forEach((c, i) => { if (current >= c.start) chapterIdx = i; });
  const chapter = guide.chapters[chapterIdx];
  const other = CERT_OTHER_GUIDE[kind];

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10">
        <h2 className="text-lg font-black">{t(CERT_PREP_TITLE)}</h2>
        <ul className="mt-3 space-y-2 text-sm font-bold">
          {CERT_PREP.map((k) => (
            <li key={k} className="flex items-start gap-2">
              <span className="mt-0.5" style={{ color: theme.accent === '#FEE500' ? '#3C1E1E' : theme.accent }}>✔</span>
              <span>{t(k)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-800 ring-1 ring-amber-200">{t(CERT_NOTE)}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-extrabold">
          <Link href={CERT_TOSS_LINK.href} className="underline underline-offset-2">{t(CERT_TOSS_LINK.label)}</Link>
          <Link href={other.href} className="underline underline-offset-2">{t(other.label)}</Link>
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {guide.chapters.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => setCurrent(c.start)}
            className={cn('rounded-full px-4 py-2 text-xs font-extrabold transition-colors', chapterIdx === i ? 'text-white' : 'bg-soft text-slate-600 hover:text-slate-900')}
            style={chapterIdx === i ? { backgroundColor: theme.frame } : undefined}
          >
            {c.icon} {tc(c.title)}
          </button>
        ))}
      </div>

      <section className="rounded-3xl bg-slate-50/70 p-4 shadow-md ring-1 ring-slate-200/60 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: theme.frame }}>{name}</span>
          <span className="text-xs font-black text-slate-600">{current + 1} / {slides.length}</span>
        </div>

        <div className="mt-4 flex justify-center">
          <CertSlideFrame key={`${kind}-${current}`} slide={slide} index={current} theme={theme} label={`${name} guide step`} />
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <button type="button" onClick={() => go(-1)} disabled={current === 0} aria-label="previous" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow disabled:opacity-30">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>
          <span className="min-w-[4.5rem] text-center text-xs font-black text-slate-600">{current + 1} / {slides.length}</span>
          <button type="button" onClick={() => go(1)} disabled={current === slides.length - 1} aria-label="next" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow disabled:opacity-30" style={{ backgroundColor: theme.frame }}>
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        </div>

        <div className="mt-5 text-center">
          {chapter && <p className="text-[11px] font-black text-slate-500">{chapter.icon} {tc(chapter.title)}</p>}
          <ol className="mx-auto mt-2 max-w-md space-y-1.5 text-sm leading-relaxed text-slate-700">
            {slide.markers.map((m, i) => (
              <li key={i} className="whitespace-pre-line">
                {slide.markers.length > 1 && m.text !== 'GUIDE_CONGRATS' ? <span className="mr-1 font-black">{i + 1}.</span> : null}
                {tc(m.text)}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {slides.map((_, idx) => (
            <button key={idx} type="button" onClick={() => setCurrent(idx)} className={cn('h-2 rounded-full transition-all duration-300', current === idx ? 'w-5 bg-slate-800' : 'w-2 bg-slate-300')} aria-label={`Go to step ${idx + 1}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
