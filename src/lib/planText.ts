import { won } from '@/lib/plans';

/**
 * 요금제의 음성·문자·데이터 글자를 번역한다.
 * 통째로 번역이 있으면 그것을 쓰고, 없으면 숫자 뒤의 단위(분·건)와 낱말(기본제공·부가·매일·추가)만 바꾼다.
 * 한국어에서는 글자를 그대로 둔다.
 */
export function planText(text: string, t: (key: string) => string): string {
  // "100건"은 예전부터 "건수"(case) 뜻으로 번역된 사전이 있어서, 문자 개수는 따로 처리한다
  const sms = text.match(/^(\d+)건$/);
  if (sms && t('분') !== '분') return `${sms[1]} ${t('메시지 건')}`;
  const whole = t(text);
  if (whole !== text) return whole;
  if (t('분') === '분') return text;
  return text
    .replace(/기본제공/g, t('기본제공'))
    .replace(/(\d+(?:\.\d+)?)분/g, (_, n) => `${n} ${t('분')}`)
    .replace(/(\d+)건/g, (_, n) => `${n} ${t('메시지 건')}`)
    .replace(/부가/g, t('부가'))
    .replace(/매일/g, t('매일'))
    .replace(/추가/g, t('추가'));
}

/**
 * 휴대폰 가격 문구를 번역한다. "월 110,834원" 처럼 숫자만 다른 문구는 "월"과 "원"만 그 나라 말로 바꾼다.
 * 그 밖의 문구(예: "기기값 0원")는 사전 번역을 그대로 쓴다. 한국어에서는 글자를 그대로 둔다.
 */
export function phonePrice(price: string, t: (key: string) => string): string {
  const m = price.match(/^월 ([\d,]+)원$/);
  if (!m) return t(price);
  return `${t('월')} ${won(Number(m[1].replace(/,/g, '')), t)}`;
}

/**
 * 할인 안내 문구를 번역한다. "7개월 후 59,950원" 같은 문구는 숫자만 바뀌므로 틀(문장 모양)을 번역해서 끼워 넣는다.
 * 한국어에서는 글자를 그대로 둔다.
 */
export function planNote(note: string, t: (key: string) => string): string {
  const m = note.match(/^(\d+)개월 후 ([\d,]+)원$/);
  if (!m) return t(note);
  const price = won(Number(m[2].replace(/,/g, '')), t);
  const frame = t('{n}개월 후 {price}');
  if (frame === '{n}개월 후 {price}') return `${m[1]}개월 후 ${price}`;
  return frame.replace('{n}', m[1]).replace('{price}', price);
}
