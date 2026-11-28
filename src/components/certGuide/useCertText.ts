'use client';

import { useLang } from '@/components/LangProvider';
import { CERT_TEXTS } from '@/lib/guides/cert/certGuideTexts';

/**
 * 카카오톡·PASS 안내 문구. 키는 한국어 문장이고, 그 언어에 없으면 영어, 그래도 없으면 한국어 원문을 쓴다.
 */
export function useCertText() {
  const lang = useLang();
  const code = lang === 'kr' ? 'ko' : lang;
  return (key: string): string => {
    if (code === 'ko') return CERT_TEXTS.ko?.[key] ?? key;
    return CERT_TEXTS[code]?.[key] ?? CERT_TEXTS.en?.[key] ?? CERT_TEXTS.ko?.[key] ?? key;
  };
}

export function useIsRtl() {
  return useLang() === 'ur';
}
