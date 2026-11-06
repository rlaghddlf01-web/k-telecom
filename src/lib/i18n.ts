// 한국어 문장 자체가 번역 키입니다. t('한국어 문장')으로 감싸 두면
// 외국어 사전(locales/{lang}.json)을 붙일 때 이 함수만 바꾸면 됩니다.
export function t(key: string): string {
  return key;
}
