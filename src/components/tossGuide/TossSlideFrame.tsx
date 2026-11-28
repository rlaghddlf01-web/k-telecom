'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { useLang } from '@/components/LangProvider';
import { TOSS_MARKER_TEXTS } from '@/lib/guides/toss/tossMarkerTexts';
import type { TossSlide } from '@/lib/guides/toss/tossGuideData';
import { useTossText } from './useTossText';

/**
 * 폰 테두리 + 화면 사진 + 누를 곳 점선 박스(깜빡임) + 사진 위 설명 말풍선.
 * 하나·카카오·PASS 가이드와 같은 모양입니다. 말풍선 글은 고객 언어, [ ] 안은 앱 화면의 버튼 글자 그대로입니다.
 */
export function TossSlideFrame({ slide, index, size = 'lg' }: {
  slide: TossSlide;
  index: number;
  /** sm: 작은 미리보기, md: Step 안에서 크게, lg: 전체화면 */
  size?: 'sm' | 'md' | 'lg';
}) {
  const tt = useTossText();
  const lg = size !== 'sm';
  const md = size === 'md';

  const lang = useLang();
  const code = lang === 'kr' ? 'ko' : lang;
  const markerText = (label: string) => TOSS_MARKER_TEXTS[code]?.[label] ?? TOSS_MARKER_TEXTS.en?.[label] ?? label;
  // 말풍선 아래 끝 = 박스 위쪽 가장자리. 위에서부터 보면서 앞 말풍선과 겹치면 아래로 민다
  const tops: number[] = [];
  const order = slide.markers.map((mk, i) => ({ i, y: mk.y - mk.height / 2 - 0.8 })).sort((a, b) => a.y - b.y);
  let prev = -100;
  for (const o of order) { const y = Math.max(o.y, prev + 6.5); tops[o.i] = y; prev = y; }

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div
        className={cn(
          'relative w-full bg-white',
          lg
            ? (md
              ? 'max-w-[360px] shadow-2xl rounded-[2.2rem] border-[10px] border-[#0064FF] ring-4 ring-white/10'
              : 'max-w-[480px] shadow-2xl rounded-[2.5rem] border-[10px] sm:border-[16px] border-[#0064FF] ring-8 ring-white/10 ring-offset-2 ring-offset-slate-200')
            : 'max-w-[240px] sm:max-w-[260px] shadow-xl rounded-[2rem] border-[8px] border-[#0064FF] ring-4 ring-white/10'
        )}
      >
        <img
          src={slide.image}
          alt={`Toss Guide Step ${index + 1}`}
          className={cn('w-full h-auto block', lg ? 'rounded-[1.8rem] sm:rounded-[2.2rem]' : 'rounded-[1.4rem]')}
        />
        <div className="absolute inset-0 pointer-events-none">
          {slide.markers.map((mk, i) => (
            <div
              key={i}
              className={cn(
                'absolute border-dashed animate-pulse',
                lg ? 'border-[4px] sm:border-[6px] rounded-2xl sm:rounded-[2rem]' : 'border-[3px] rounded-xl',
                mk.warn
                  ? 'border-red-500 bg-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                  : 'border-[#0064FF] bg-[#0064FF]/20 shadow-[0_0_25px_rgba(0,100,255,0.8)]'
              )}
              style={{ left: `${mk.x}%`, top: `${mk.y}%`, width: `${mk.width}%`, height: `${mk.height}%`, transform: 'translate(-50%, -50%)', zIndex: 50 }}
            />
          ))}

          {/* 칸마다 말풍선: 박스 바로 위에 두고, 서로 겹치면 아래로 밀어서 간격을 둔다 */}
          {slide.markers.map((mk, i) => (
            <div
              key={`b${i}`}
              className="absolute z-[60] w-full flex justify-center px-2"
              style={{ top: `${tops[i]}%`, transform: 'translateY(-100%)' }}
            >
              <div
                className={cn(
                  'relative text-white font-black flex items-start gap-1 border-2 border-white shadow-xl text-left px-2 py-1 rounded-lg max-w-[94%]',
                  mk.warn ? 'bg-red-600' : 'bg-[#0064FF]'
                )}
                style={{ fontSize: md ? '11px' : lg ? 'clamp(11px,2.6vw,15px)' : '9px' }}
              >
                {slide.markers.length > 1 && <span>{i + 1}.</span>}
                <span className="leading-snug break-words">{mk.label ? markerText(mk.label) : ''}</span>
                <div className={cn('absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-white', mk.warn ? 'bg-red-600' : 'bg-[#0064FF]')} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {(slide.note || slide.hasSample) && (
        <div className={cn('w-full text-left space-y-2', md ? 'max-w-[360px]' : lg ? 'max-w-[480px]' : 'max-w-[300px]')}>
          {slide.note && (
            <p className={cn('font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-xl leading-relaxed', lg ? 'text-sm p-3' : 'text-[11px] p-2')}>
              💡 {tt(slide.note)}
            </p>
          )}
          {slide.hasSample && <p className="text-[11px] font-medium text-slate-500">{tt('sampleNote')}</p>}
        </div>
      )}
    </div>
  );
}