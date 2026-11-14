// 지원 언어 18개 (K-Market 과 같은 코드·같은 주소 규칙: 한국어는 /, 나머지는 /vi 처럼 앞에 붙는다)
export const LANG_CODES = ['ko', 'en', 'ja', 'ru', 'vi', 'zh', 'th', 'uz', 'km', 'mn', 'ne', 'id', 'my', 'si', 'kk', 'bn', 'ur', 'tl'] as const;
export type Lang = (typeof LANG_CODES)[number];
export const DEFAULT_LANG: Lang = 'ko';

export interface LangInfo {
  code: Lang;
  name: string;
  country: string;
  flag: string;
}

/** 언어 선택 화면에 보이는 순서 (K-Market 과 동일) */
export const LANGS: LangInfo[] = [
  { code: 'ko', name: '한국어', country: '대한민국 (South Korea)', flag: 'kr' },
  { code: 'en', name: 'English', country: 'United States / Global', flag: 'us' },
  { code: 'ja', name: '日本語', country: 'Japan', flag: 'jp' },
  { code: 'ru', name: 'Русский', country: 'Russia / CIS', flag: 'ru' },
  { code: 'vi', name: 'Tiếng Việt', country: 'Vietnam', flag: 'vn' },
  { code: 'zh', name: '中文', country: 'China', flag: 'cn' },
  { code: 'th', name: 'ไทย', country: 'Thailand', flag: 'th' },
  { code: 'uz', name: "O'zbekcha", country: 'Uzbekistan', flag: 'uz' },
  { code: 'km', name: 'ភាសាខ្មែរ', country: 'Cambodia', flag: 'kh' },
  { code: 'mn', name: 'Монгол', country: 'Mongolia', flag: 'mn' },
  { code: 'ne', name: 'नेपाली', country: 'Nepal', flag: 'np' },
  { code: 'id', name: 'Bahasa Indonesia', country: 'Indonesia', flag: 'id' },
  { code: 'my', name: 'မြန်မာဘာသာ', country: 'Myanmar', flag: 'mm' },
  { code: 'si', name: 'සිංහල', country: 'Sri Lanka', flag: 'lk' },
  { code: 'kk', name: 'Қазақша', country: 'Kazakhstan', flag: 'kz' },
  { code: 'bn', name: 'বাংলা', country: 'Bangladesh', flag: 'bd' },
  { code: 'ur', name: 'اردو', country: 'Pakistan', flag: 'pk' },
  { code: 'tl', name: 'Tagalog / Filipino', country: 'Philippines', flag: 'ph' },
];

export const flagUrl = (flag: string) => `https://flagcdn.com/w160/${flag}.png`;

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANG_CODES as readonly string[]).includes(v);

export const langInfo = (code: string): LangInfo => LANGS.find((l) => l.code === code) ?? LANGS[0];

/** 서버가 직접 처리하는 주소 (언어가 붙지 않는다) */
const UNPREFIXED = /^\/(admin|api|_next)(\/|$)/;

/** 사이트 안 주소에 언어를 붙인다: ('/plans','vi') → '/vi/plans'. 한국어·외부 주소·이미 붙은 주소는 그대로 */
export function localizePath(href: string, lang: Lang): string {
  if (lang === DEFAULT_LANG || !href.startsWith('/') || href.startsWith('//') || UNPREFIXED.test(href)) return href;
  const first = href.split(/[/?#]/)[1];
  if (isLang(first) && first !== DEFAULT_LANG) return href;
  if (href === '/') return `/${lang}`;
  return `/${lang}${href}`;
}

/** 주소 앞의 언어 부분을 뗀다: '/vi/plans' → '/plans' */
export function stripLang(pathname: string): string {
  const first = pathname.split('/')[1];
  if (isLang(first) && first !== DEFAULT_LANG) return pathname.slice(first.length + 1) || '/';
  return pathname || '/';
}

/** 주소에서 언어를 읽는다 (없으면 한국어) */
export function langOfPath(pathname: string): Lang {
  const first = pathname.split('/')[1];
  return isLang(first) ? first : DEFAULT_LANG;
}
