// 한국어 문장 자체가 번역 키입니다. t('한국어 문장')으로 감싸 두면 요청한 언어의 사전에서 번역을 찾고,
// 없으면 한국어가 그대로 나옵니다. (서버 컴포넌트 전용. 클라이언트 컴포넌트는 useT() 를 씁니다.)
import 'server-only';
import { cache } from 'react';
import { dictionaryOf } from '@/lib/dictionaries';
import { DEFAULT_LANG, isLang, type Lang } from '@/lib/langs';

/** 요청 하나마다 따로 쓰이는 저장 칸: 레이아웃이 주소의 언어를 넣어 두면 t() 가 꺼내 쓴다 */
const scope = cache(() => ({ lang: DEFAULT_LANG as Lang }));

export function setLang(lang: Lang) {
  scope().lang = lang;
}

export function getLang(): Lang {
  return scope().lang;
}

export function t(key: string): string {
  return dictionaryOf(scope().lang)[key] ?? key;
}

/**
 * 페이지 본문이 t() 를 부르기 전에 주소의 언어를 먼저 정해 준다.
 * (레이아웃과 페이지는 동시에 그려지기 때문에, 페이지 스스로 언어를 정해야 순서와 상관없이 안전하다)
 */
export function withLang<P>(page: (props: P) => React.ReactNode | Promise<React.ReactNode>) {
  return async function LangPage(props: P & { params: Promise<{ lang: string }> }) {
    const { lang } = await props.params;
    if (isLang(lang)) setLang(lang);
    return page(props);
  };
}
