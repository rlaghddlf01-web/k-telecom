// 홈 화면 구역의 문구를 관리자가 바꾼 문구로 바꿔 주는 도우미 (서버 전용).
// 요청마다 따로 쓰이는 저장 칸에 문구 목록을 넣어 두고, 구역 컴포넌트가 ht() 로 꺼내 씁니다.
import { cache } from 'react';
import { t } from '@/lib/i18n';

const store = cache(() => ({ texts: {} as Record<string, string> }));

export function setHomeTexts(texts: Record<string, string>) {
  store().texts = texts;
}

/** 관리자가 바꾼 문구가 있으면 그것을, 없으면 기본 문장을 돌려준다 */
export function ht(key: string): string {
  return t(store().texts[key] ?? key);
}
