'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_LANG, type Lang } from '@/lib/langs';

interface LangState {
  lang: Lang;
  dict: Record<string, string>;
}

const LangContext = createContext<LangState>({ lang: DEFAULT_LANG, dict: {} });

/** 레이아웃이 현재 언어와 그 언어의 번역 사전을 클라이언트 컴포넌트에 내려 준다 */
export function LangProvider({ lang, dict, children }: LangState & { children: React.ReactNode }) {
  return <LangContext.Provider value={{ lang, dict }}>{children}</LangContext.Provider>;
}

export const useLang = (): Lang => useContext(LangContext).lang;

/** 클라이언트 컴포넌트용 t(): 서버의 t() 와 같은 규칙 */
export function useT(): (key: string) => string {
  const { dict } = useContext(LangContext);
  return (key) => dict[key] ?? key;
}
