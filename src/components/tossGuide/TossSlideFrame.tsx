'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';
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

  // 말풍선은 박스 묶음의 위쪽(박스가 아래쪽이면) 또는 아래쪽에 붙임
  const top = Math.min(...slide.markers.map((mk) => mk.y - mk.height / 2));
  const bottom = Math.max(...slide.markers.map((mk) => mk.y + mk.height / 2));
  const above = top > 24;
  const anyWarn = slide.markers.some((mk) => mk.warn);

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

          <div
            className="absolute z-[60] w-full flex justify-center px-2"
            style={above ? { top: `${top - 1.5}%`, transform: 'translateY(-100%)' } : { top: `${bottom + 1.5}%` }}
          >
            <div
              className={cn(
                'relative text-white font-black flex items-start gap-2 border-2 border-white shadow-xl text-left',
                anyWarn ? 'bg-red-600 ring-red-600/30' : 'bg-[#0064FF] ring-[#0064FF]/30',
                lg ? 'px-4 py-3 sm:px-6 sm:py-4 rounded-2xl sm:rounded-[1.75rem] ring-4 max-w-[94%]' : 'px-2.5 py-2 rounded-xl ring-2 max-w-[96%]'
              )}
              style={{ fontSize: md ? '13px' : lg ? 'clamp(12px,3.2vw,19px)' : '10px' }}
            >
              <Info className={cn('shrink-0 mt-0.5', lg ? 'w-5 h-5' : 'w-3.5 h-3.5')} />
              <span className="leading-snug break-words">{tt(slide.bubble)}</span>
              <div
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-white',
                  anyWarn ? 'bg-red-600' : 'bg-[#0064FF]',
                  above ? '-bottom-2.5 border-r-2 border-b-2' : '-top-2.5 border-l-2 border-t-2'
                )}
              />
            </div>
          </div>
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