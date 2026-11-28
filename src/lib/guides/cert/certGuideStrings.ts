/** 카카오톡·PASS 안내 페이지의 준비물·안내 문구 (한국어 키 → 사이트 번역 저장소로 번역) */
export const CERT_PREP = ['한국 휴대폰 번호 (본인 명의)', '외국인등록증 (또는 주민등록증)', '본인 명의 은행 계좌 (1원 인증용)', '스마트폰 (안내 화면은 안드로이드 기준)'];
export const CERT_PREP_TITLE = '준비물';
export const CERT_NOTE = '프리티 셀프개통의 본인확인은 현재 토스·네이버 간편인증으로 안내하고 있어요(바뀔 수 있어요). 이 안내는 카카오톡 또는 PASS 인증서가 필요할 때 따라 하세요.';
export const CERT_OTHER_GUIDE = {
  kakao: { href: '/guide/pass', label: 'PASS 인증서 만들기' },
  pass: { href: '/guide/kakao', label: '카카오톡 인증서 만들기' },
} as const;
export const CERT_TOSS_LINK = { href: '/guide/toss', label: '토스 인증서 만들기' };
