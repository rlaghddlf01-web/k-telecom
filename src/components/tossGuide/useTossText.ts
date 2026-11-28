'use client';

import { useLang } from '@/components/LangProvider';
import { TOSS_TEXTS, type TossTextKey } from '@/lib/guides/toss/tossGuideTexts';
import { TOSS_TEXTS_EXTRA, type TossExtraLang } from '@/lib/guides/toss/tossGuideTextsExtra';
import { TOSS_NOTES, type TossNoteKey } from '@/lib/guides/toss/tossGuideNotes';

/**
 * 현재 언어의 토스 가이드 문구. 그 언어에 없는 문구는 영어, 그래도 없으면 한국어.
 * (원본 15개 언어 + 새로 번역한 일본어·러시아어·타갈로그어 + 케이텔레콤에서 추가한 주의 문구)
 */
export function useTossText() {
  const lang = useLang();
  const code = lang === 'kr' ? 'ko' : lang;
  const base = TOSS_TEXTS[code];
  const extra = TOSS_TEXTS_EXTRA[code as TossExtraLang];
  return (key: TossTextKey | TossNoteKey): string => {
    if (key in (TOSS_NOTES.en ?? {})) {
      const k = key as TossNoteKey;
      return TOSS_NOTES[code]?.[k] ?? TOSS_NOTES.en[k] ?? TOSS_NOTES.ko[k];
    }
    const k = key as TossTextKey;
    return base?.[k] ?? extra?.[k] ?? TOSS_TEXTS.en[k] ?? TOSS_TEXTS.ko[k];
  };
}

export function useIsRtl() {
  return useLang() === 'ur';
}
