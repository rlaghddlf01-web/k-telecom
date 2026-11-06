// 배너 테마 색 (Tailwind 클래스는 문자열 그대로 있어야 빌드에 포함되므로 한곳에 모아 둔다)
import type { PhoneKind } from '@/components/PhoneMockup';
import type { ThemeKey } from '@/lib/content/types';

export interface Theme {
  /** 배경 그라데이션 클래스 */
  bg: string;
  /** 큰 배너 뒤에 깔리는 빛 번짐 색 */
  glow: string;
  /** 이미지가 없을 때 보여줄 폰 목업 2대 */
  phones: [{ kind: PhoneKind; from: string; to: string }, { kind: PhoneKind; from: string; to: string }];
}

export const THEMES: Record<ThemeKey, Theme> = {
  violet: {
    bg: 'from-[#05060d] via-[#0d0b24] to-[#1a0f3d]',
    glow: 'rgba(109,93,252,0.55)',
    phones: [{ kind: 'island', from: '#6d5dfc', to: '#e8174f' }, { kind: 'back', from: '#38bdf8', to: '#6366f1' }],
  },
  sky: {
    bg: 'from-[#030b14] via-[#06223a] to-[#0a3b57]',
    glow: 'rgba(14,165,233,0.5)',
    phones: [{ kind: 'punch', from: '#34d399', to: '#0ea5e9' }, { kind: 'back', from: '#1e293b', to: '#38bdf8' }],
  },
  rose: {
    bg: 'from-[#14040c] via-[#3a0a1f] to-[#6a0f33]',
    glow: 'rgba(232,23,79,0.5)',
    phones: [{ kind: 'island', from: '#f472b6', to: '#f59e0b' }, { kind: 'back', from: '#a855f7', to: '#e8174f' }],
  },
  orange: {
    bg: 'from-orange-500 via-orange-500 to-amber-500',
    glow: 'rgba(251,146,60,0.55)',
    phones: [{ kind: 'island', from: '#1e1b4b', to: '#fb923c' }, { kind: 'back', from: '#fbbf24', to: '#ef4444' }],
  },
  blue: {
    bg: 'from-blue-700 via-blue-600 to-indigo-700',
    glow: 'rgba(59,130,246,0.55)',
    phones: [{ kind: 'punch', from: '#38bdf8', to: '#6366f1' }, { kind: 'back', from: '#1e293b', to: '#60a5fa' }],
  },
  navy: {
    bg: 'from-[#06070f] via-[#15103a] to-[#3b1670]',
    glow: 'rgba(168,85,247,0.45)',
    phones: [{ kind: 'back', from: '#6d5dfc', to: '#e8174f' }, { kind: 'island', from: '#0ea5e9', to: '#6d5dfc' }],
  },
};

export function themeOf(key: string | undefined): Theme {
  return THEMES[(key as ThemeKey) in THEMES ? (key as ThemeKey) : 'violet'];
}
