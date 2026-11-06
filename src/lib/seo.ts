/**
 * 검색엔진 노출 여부.
 * 정식 오픈 전에는 막아 두고(기본), Vercel 환경변수 ALLOW_INDEXING=true 로 바꾸면 해제됩니다.
 * 사이트 주소는 NEXT_PUBLIC_SITE_URL (예: https://새도메인) 로 지정합니다.
 */
export const INDEXING_ALLOWED = process.env.ALLOW_INDEXING === 'true';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';
