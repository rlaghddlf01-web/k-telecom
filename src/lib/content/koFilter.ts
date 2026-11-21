// 한국어 화면(/)은 한국인 고객용이라, 외국인 고객에게만 해당하는 항목은 숨긴다. (외국어 화면과 /kr 원문 화면에는 그대로 나온다)
// 문구만 바꾸면 되는 것(외국인등록증 → 신분증 등)은 locales/ko.json 에서 바꾸고, 여기서는 통째로 숨길 항목만 고른다.
import 'server-only';
import { getLang } from '@/lib/i18n';
import { DEFAULT_LANG } from '@/lib/langs';

const FOREIGN_ONLY = /(국제통화|어떤 언어를 지원|국적|모국어 선택)/;

/** 한국어 화면에서 숨겨야 하는 문구인지 */
export function hiddenForKorean(...texts: string[]): boolean {
  return getLang() === DEFAULT_LANG && FOREIGN_ONLY.test(texts.join(' '));
}
