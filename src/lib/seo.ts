/**
 * 검색엔진 노출 여부.
 * 정식 오픈 전에는 막아 두고(기본), Vercel 환경변수 ALLOW_INDEXING=true 로 바꾸면 해제됩니다.
 *
 * 사이트 주소: NEXT_PUBLIC_SITE_URL 이 있으면 그것을, 없으면 Vercel 이 알려주는
 * 운영 주소(VERCEL_PROJECT_PRODUCTION_URL, 예: k-telecom.vercel.app)를 자동으로 씁니다.
 */
export const INDEXING_ALLOWED = process.env.ALLOW_INDEXING === 'true';

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : '');
