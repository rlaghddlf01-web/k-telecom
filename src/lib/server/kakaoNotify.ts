import 'server-only';

/**
 * 사장님 카카오톡으로 알림을 보낸다 (카카오 "나에게 보내기"). 케이텔레콤 전용 카카오 앱을 쓴다.
 * 환경변수 KAKAO_REST_API_KEY, KAKAO_REFRESH_TOKEN 이 모두 있어야 켜진다. 없으면 아무것도 보내지 않는다.
 * 보내기에 실패해도 관리자 화면의 긴급 알림에는 이미 저장되어 있으므로 오류는 삼킨다.
 * 로그에는 오류 종류만 남기고 알림 내용(고객 연락처 등)은 남기지 않는다.
 */
export function isKakaoNotifyConfigured(): boolean {
  return Boolean(process.env.KAKAO_REST_API_KEY && process.env.KAKAO_REFRESH_TOKEN);
}

async function accessToken(): Promise<string | null> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.KAKAO_REST_API_KEY ?? '',
    refresh_token: process.env.KAKAO_REFRESH_TOKEN ?? '',
  });
  if (process.env.KAKAO_CLIENT_SECRET) body.set('client_secret', process.env.KAKAO_CLIENT_SECRET);
  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body,
  });
  if (!res.ok) {
    console.error('kakao token error status:', res.status);
    return null;
  }
  const data = (await res.json().catch(() => null)) as { access_token?: string } | null;
  return data?.access_token ?? null;
}

export async function sendKakaoMemo(text: string, linkUrl?: string): Promise<boolean> {
  if (!isKakaoNotifyConfigured()) return false;
  try {
    const token = await accessToken();
    if (!token) return false;
    const url = linkUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://k-telecom.vercel.app';
    const template = { object_type: 'text', text: text.slice(0, 190), link: { web_url: url, mobile_web_url: url }, button_title: '관리자 열기' };
    const res = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: new URLSearchParams({ template_object: JSON.stringify(template) }),
    });
    if (!res.ok) console.error('kakao send error status:', res.status);
    return res.ok;
  } catch (err) {
    console.error('kakao send error:', err instanceof Error ? err.name : 'unknown');
    return false;
  }
}
