'use client';

import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CertMarker, CertSlide } from '@/lib/guides/cert/certGuideData';
import { useCertText } from './useCertText';

export interface CertTheme {
  frame: string;
  bubbleBg: string;
  bubbleText: string;
  accent: string;
  accentSoft: string;
}

export const KAKAO_THEME: CertTheme = { frame: '#3C1E1E', bubbleBg: '#3C1E1E', bubbleText: '#FEE500', accent: '#FEE500', accentSoft: 'rgba(254,229,0,0.2)' };
export const PASS_THEME: CertTheme = { frame: '#1F1F1F', bubbleBg: '#1F1F1F', bubbleText: '#FFFFFF', accent: '#E6002D', accentSoft: 'rgba(230,0,45,0.18)' };

const CONGRATS = 'GUIDE_CONGRATS';

function boxClass(m: CertMarker) {
  if (m.isLarge) return 'w-[80%] h-[56%] max-h-[300px]';
  if (m.isSmall) return 'w-[13%] aspect-square';
  return 'w-[20%] aspect-square min-w-[44px]';
}

/**
 * 폰 테두리 + 화면 사진 + 누를 곳 점선 박스(깜빡임) + 사진 위 설명 말풍선.
 * 이지텍스의 카카오톡·PASS 안내와 같은 모양이고, 말풍선 글은 고객 언어입니다.
 */
export function CertSlideFrame({ slide, index, theme, label }: { slide: CertSlide; index: number; theme: CertTheme; label: string }) {
  const tc = useCertText();
  // 항목이 3개 이상이면 말풍선이 서로 겹치므로 사진 위에는 번호만 두고, 설명은 아래 번호 목록에서 읽는다
  const crowded = false;
  // 말풍선이 3개 이상이면 위에서부터 겹치지 않게 세로 간격을 벌려 배치한다 (번호를 붙여 어느 칸 설명인지 알 수 있게)
  const many = slide.markers.length >= 3;
  const order = slide.markers.map((m, i) => ({ i, y: m.textY ?? m.y })).sort((a, b) => a.y - b.y);
  const adjTop: Record<number, number> = {};
  let prev = -100;
  for (const o of order) { const y = Math.max(o.y, prev + 7); adjTop[o.i] = y; prev = y; }
  return (
    <div className="relative w-full max-w-[380px] rounded-[2.2rem] bg-white shadow-2xl ring-4 ring-white/10" style={{ border: `10px solid ${theme.frame}` }}>
      <div className="relative overflow-hidden rounded-[1.6rem]" style={{ containerType: 'inline-size' }}>
      <img src={slide.image} alt={`${label} ${index + 1}`} className="block h-auto w-full" />
      <div className="pointer-events-none absolute inset-0">
        {slide.markers.map((m, i) => {
          const congrats = m.text === CONGRATS;
          const hasPos = m.textX !== undefined || m.textY !== undefined;
          const bx = m.textX ?? m.x;
          const by = m.textY ?? m.y;
          // 위치를 따로 정하지 않았으면 박스 위(기본) 또는 아래(position: bottom)에 붙인다
          const shift = hasPos ? '0px' : m.position === 'bottom' ? 'calc(50% + 9%)' : 'calc(-50% - 9%)';
          return (
            <div key={i}>
              {!m.hideBox && (
                <div
                  className={cn('absolute animate-pulse rounded-2xl border-[3px] border-dashed', boxClass(m))}
                  style={{
                    left: `${m.x}%`,
                    top: `${m.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 50,
                    borderColor: m.isRed ? '#ff0000' : theme.accent,
                    backgroundColor: m.isRed ? 'rgba(255,0,0,0.2)' : theme.accentSoft,
                    boxShadow: `0 0 18px ${m.isRed ? 'rgba(255,0,0,0.6)' : theme.accentSoft}`,
                  }}
                />
              )}
              {m.text && crowded && (
                <div
                  className="absolute z-[60] flex h-[6.5cqw] w-[6.5cqw] min-h-[20px] min-w-[20px] items-center justify-center rounded-full text-[3.4cqw] font-black shadow-lg"
                  style={{ left: `${Math.min(m.x + 12, 94)}%`, top: `${m.y}%`, transform: 'translate(-50%, -50%)', backgroundColor: theme.bubbleBg, color: theme.bubbleText, border: `2px solid ${theme.accent}`, fontSize: 'max(11px, 3.4cqw)' }}
                >
                  {i + 1}
                </div>
              )}
              {m.text && !crowded && (
                <div
                  className="absolute z-[60] flex w-full justify-center px-2"
                  style={{ left: 0, top: `${many ? adjTop[i] : by}%`, transform: `translateY(calc(-50% + ${shift}))`, ...(hasPos && bx !== 50 ? { left: `${bx - 50}%` } : null) }}
                >
                  <div
                    className={cn('relative flex max-w-[92%] items-start gap-1 rounded-lg px-2 py-1 text-left font-black shadow-xl', congrats && 'whitespace-pre-line text-center')}
                    style={{
                      backgroundColor: theme.bubbleBg,
                      color: m.isRed ? '#ff4d4d' : theme.bubbleText,
                      border: `2px solid ${m.isRed ? '#ff0000' : theme.accent}`,
                      // 사진 폭에 맞춰 글자 크기를 줄이고 늘린다 (원본 fontSize 10 ≈ 폭 360px 에서 10px)
                      fontSize: `max(10.5px, ${((m.fontSize ?? (congrats ? 12 : 10)) / 2.7).toFixed(2)}cqw)`,
                    }}
                  >
                    {!congrats && !many && <Info className="mt-px h-3 w-3 shrink-0" />}
                    <span className="break-words leading-snug">{many ? `${i + 1}. ` : ''}{tc(m.text)}</span>
                    {!congrats && !m.hideArrow && (
                      <div
                        className={cn('absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45', m.position === 'bottom' ? '-top-[7px] border-l-2 border-t-2' : '-bottom-[7px] border-b-2 border-r-2')}
                        style={{ backgroundColor: theme.bubbleBg, borderColor: m.isRed ? '#ff0000' : theme.accent }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
