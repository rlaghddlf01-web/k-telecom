import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LANG, isLang } from '@/lib/langs';

/**
 * 언어 주소 규칙 (K-Market 과 동일):
 *  - 한국어는 주소 앞에 아무것도 붙이지 않는다 (/plans)
 *  - 다른 언어는 /vi/plans 처럼 언어 코드를 붙인다
 * 파일은 모두 app/[lang] 아래에 있으므로, 언어가 없는 주소는 내부적으로 /ko 로 보내서 처리한다.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split('/')[1];

  if (first === DEFAULT_LANG) {
    // /ko/... 는 대표 주소(/...)로 보낸다
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LANG.length + 1) || '/';
    return NextResponse.redirect(url, 308);
  }
  if (isLang(first)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANG}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // 관리자, API, 정적 파일(확장자가 있는 주소), Next 내부 경로는 건드리지 않는다
  matcher: ['/((?!admin|api|_next|pwa-icon|.*\\..*).*)'],
};
