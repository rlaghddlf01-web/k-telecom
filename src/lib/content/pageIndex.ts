// 관리자의 [페이지] 탭이 다루는 서브 페이지 목록.
//  - 기본 페이지(registry): lib/pages.ts 에 제목·설명·본문 블록이 모두 있는 페이지. 전부 수정 가능
//  - 전용 페이지(dedicated): 목록·신청서 같은 기능 화면. 제목과 설명 문구만 수정 가능
//  - 직접 만든 페이지(custom): 관리자가 새로 만든 페이지. DB(telecom_pages)에만 있다
import { PAGES } from '@/lib/pages';

export interface PageMeta {
  path: string;
  title: string;
  lead: string;
}

export const DEDICATED_PAGES: PageMeta[] = [
  { path: '/plans', title: '요금제 안내', lead: '통신망, 데이터량, 요금으로 비교하고 나에게 맞는 요금제를 찾아보세요.' },
  { path: '/plans/apply', title: '가입접수', lead: '신청서를 남기시면 상담원이 연락드려 본인 확인과 개통을 도와드립니다.' },
  { path: '/plans/esim', title: 'eSIM 안내', lead: '유심을 기다리지 않고 바로 개통하는 eSIM을 안내합니다.' },
  { path: '/phones', title: '단말 목록', lead: '갤럭시 A시리즈 미개봉 신제품과 정품 검수 리퍼비시 아이폰을 초기비용 0원으로 만나보세요.' },
  { path: '/events', title: '이벤트', lead: '진행 중인 혜택과 이벤트를 확인하세요.' },
  { path: '/partnership', title: '제휴 신청', lead: '외국인 대상 통신 상품 공급을 함께할 파트너사를 모십니다.' },
  { path: '/support/notice', title: '공지사항', lead: '' },
  { path: '/support/faq', title: '자주 묻는 질문', lead: '' },
  { path: '/support/inquiry', title: '1:1 상담문의', lead: '궁금한 점을 남겨주시면 담당자가 연락드립니다.' },
];

export type PageKind = 'registry' | 'dedicated' | 'custom';

export const findDedicated = (path: string) => DEDICATED_PAGES.find((p) => p.path === path);
export const findRegistry = (path: string) => PAGES.find((p) => p.path === path);

/** 직접 만든 페이지가 쓸 수 없는 주소 (사이트의 다른 기능과 겹치는 곳) */
const RESERVED_PREFIXES = ['/admin', '/api', '/_next', '/phones/item', '/plans/view', '/events/', '/support/notice/', '/robots', '/sitemap'];

/** 직접 만든 페이지 주소 검사: 영문 소문자·숫자·-·_·/ 만, 최대 80자 */
export function checkNewPagePath(path: string): string | null {
  if (!/^\/[a-z0-9][a-z0-9/_-]*$/.test(path) || path.length > 80 || path.includes('//') || path.endsWith('/')) {
    return '페이지 주소는 /company-news 처럼 영문 소문자, 숫자, -, _ 로 입력해 주세요.';
  }
  if (RESERVED_PREFIXES.some((p) => path === p || path.startsWith(p.endsWith('/') ? p : `${p}/`) || path === p.replace(/\/$/, ''))) {
    return '사이트의 다른 기능이 쓰는 주소라서 사용할 수 없습니다.';
  }
  if (findRegistry(path) || findDedicated(path)) return '이미 있는 페이지 주소입니다. 목록에서 해당 페이지를 수정해 주세요.';
  return null;
}
