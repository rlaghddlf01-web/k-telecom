// 상담 창 설정: 매니저 소개와 왓츠앱·텔레그램·페이스북 메신저·카카오톡 연결 정보.
// 관리자는 주소 전체가 아니라 "번호/아이디"만 입력하고, 실제 주소는 여기서 만든다 (엉뚱한 주소가 걸리지 않게).

export interface ChatSettings {
  managerName: string;
  managerRole: string;
  intro: string;
  /** 상담 창이 닫혀 있을 때 버튼 위에 뜨는 말풍선 */
  teaser: string;
  avatar: string;
  /** 왓츠앱: 국가번호를 포함한 숫자 (예: 821012345678) */
  whatsapp: string;
  /** 텔레그램 사용자명 또는 봇 이름 (예: ktelecom_support) */
  telegram: string;
  /** 페이스북 페이지 아이디 (예: ktelecom.official) */
  messenger: string;
  /** 카카오톡 오픈채팅 주소 (https://open.kakao.com/ 으로 시작) */
  kakao: string;
  /** AI 매니저 실시간 채팅 사용 여부 */
  aiEnabled: boolean;
}

export const DEFAULT_CHAT: ChatSettings = {
  managerName: 'K-Telecom 공식 매니저',
  managerRole: '공식 매니저',
  intro: '통신·요금제·단말 가입을 도와 드립니다.',
  teaser: '요금제, 핸드폰에 대해 궁금하세요? 😊 궁금한 점이 있으시거나 도움이 필요하시면 언제든 말씀해 주세요!',
  avatar: '',
  whatsapp: '',
  telegram: '',
  messenger: '',
  kakao: '',
  aiEnabled: true,
};

const clip = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

export type ChatChecked = { ok: true; value: ChatSettings } | { ok: false; error: string };

export function sanitizeChat(input: unknown): ChatChecked {
  if (!input || typeof input !== 'object') return { ok: false, error: '잘못된 요청입니다.' };
  const c = input as Record<string, unknown>;

  const whatsapp = clip(c.whatsapp, 30).replace(/[^\d]/g, '');
  if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 15)) {
    return { ok: false, error: '왓츠앱 번호는 국가번호를 포함한 숫자 8~15자리로 입력해 주세요. 예: 821012345678' };
  }

  const telegram = clip(c.telegram, 40).replace(/^@/, '').replace(/^https?:\/\/t\.me\//i, '');
  if (telegram && !/^[A-Za-z0-9_]{4,32}$/.test(telegram)) {
    return { ok: false, error: '텔레그램 아이디는 영문·숫자·_ 4~32자로 입력해 주세요. 예: ktelecom_support' };
  }

  const messenger = clip(c.messenger, 60).replace(/^https?:\/\/(www\.)?(m\.me|facebook\.com)\//i, '').replace(/\/$/, '');
  if (messenger && !/^[A-Za-z0-9.\-]{3,60}$/.test(messenger)) {
    return { ok: false, error: '페이스북 페이지 아이디는 영문·숫자·.·- 로 입력해 주세요. 예: ktelecom.official' };
  }

  const kakao = clip(c.kakao, 200);
  if (kakao && !/^https:\/\/open\.kakao\.com\/[A-Za-z0-9/_\-]+$/.test(kakao)) {
    return { ok: false, error: '카카오톡은 https://open.kakao.com/ 으로 시작하는 오픈채팅 주소를 입력해 주세요.' };
  }

  const avatar = clip(c.avatar, 300);
  if (avatar && !/^(\/[^/\\][^\s]*|https:\/\/[^\s]+)$/.test(avatar)) {
    return { ok: false, error: '매니저 사진 주소가 올바르지 않습니다.' };
  }

  return {
    ok: true,
    value: {
      managerName: clip(c.managerName, 40) || DEFAULT_CHAT.managerName,
      managerRole: clip(c.managerRole, 30) || DEFAULT_CHAT.managerRole,
      intro: clip(c.intro, 120) || DEFAULT_CHAT.intro,
      teaser: clip(c.teaser, 200) || DEFAULT_CHAT.teaser,
      avatar,
      whatsapp,
      telegram,
      messenger,
      kakao,
      aiEnabled: c.aiEnabled !== false,
    },
  };
}

export interface ChatChannel {
  id: 'whatsapp' | 'telegram' | 'messenger' | 'kakao';
  label: string;
  href: string;
}

/** 아직 연결하지 않은 메신저 버튼이 눌렸을 때 가는 곳 (사이트 안 1:1 상담문의) */
export const CHAT_FALLBACK_HREF = '/support/inquiry';

/** 왓츠앱·텔레그램·메신저는 연결 전에도 버튼을 보여 주고(문의 페이지로 이동), 카카오톡은 설정했을 때만 보인다 (label 은 번역 키) */
export function chatChannels(s: ChatSettings): ChatChannel[] {
  const list: ChatChannel[] = [];
  list.push({ id: 'whatsapp', label: '왓츠앱 실시간 상담', href: s.whatsapp ? `https://wa.me/${s.whatsapp}` : CHAT_FALLBACK_HREF });
  list.push({ id: 'telegram', label: '텔레그램 실시간 상담', href: s.telegram ? `https://t.me/${s.telegram}` : CHAT_FALLBACK_HREF });
  list.push({ id: 'messenger', label: '페이스북 메신저 상담', href: s.messenger ? `https://m.me/${s.messenger}` : CHAT_FALLBACK_HREF });
  if (s.kakao) list.push({ id: 'kakao', label: '카카오톡 실시간 상담', href: s.kakao });
  return list;
}
