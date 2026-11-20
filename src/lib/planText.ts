/**
 * 요금제의 음성·문자·데이터 글자를 번역한다.
 * 통째로 번역이 있으면 그것을 쓰고, 없으면 숫자 뒤의 단위(분·건)와 낱말(기본제공·부가·매일)만 바꾼다.
 * 한국어에서는 글자를 그대로 둔다.
 */
export function planText(text: string, t: (key: string) => string): string {
  const whole = t(text);
  if (whole !== text) return whole;
  if (t('분') === '분') return text;
  return text
    .replace(/기본제공/g, t('기본제공'))
    .replace(/(\d+(?:\.\d+)?)분/g, (_, n) => `${n} ${t('분')}`)
    .replace(/(\d+)건/g, (_, n) => `${n} ${t('건')}`)
    .replace(/부가/g, t('부가'))
    .replace(/매일/g, t('매일'));
}
