// 사이트 사전에 없는 문구(관리자가 새로 넣은 휴대폰 이름·설명 등)를 이번 요청에서 쓸 수 있게 번역해 둔다 (서버 전용).
// 저장소에 번역이 있으면 꺼내 쓰고, 없으면 AI 로 번역해서 저장한다. 돌려주는 값은 클라이언트 컴포넌트에 넘길 때 쓴다.
import 'server-only';
import { addExtraTranslations, getLang } from '@/lib/i18n';
import { translateTexts } from '@/lib/server/translate';

export async function primeTranslations(texts: string[]): Promise<Record<string, string>> {
  const map = await translateTexts(texts, getLang());
  addExtraTranslations(map);
  return map;
}
