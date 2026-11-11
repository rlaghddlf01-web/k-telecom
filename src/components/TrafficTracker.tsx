'use client';

import { useEffect } from 'react';

// 방문 추적: 접속할 때 유입 채널(광고 태그·이전 주소)을 판별해 /api/traffic 으로 한 번 보낸다.
// 채널 이름(key)은 K-Market 관리자 대시보드의 16대 채널과 같아야 합니다.

const SESSION_KEY = 'ktel_last_visit_session';
const VISITOR_KEY = 'ktrs_visitor_id';
const SESSION_GAP_MS = 10 * 60 * 1000; // 같은 탭에서 10분 안의 재방문은 다시 세지 않음

type Channel = { key: string; name: string };

// utm_source 에서 찾을 단어. 짧은 약어(tt, fb ...)는 단어가 정확히 같을 때만 인정한다 (예: twitter 가 tt 로 오인되지 않게)
const UTM_RULES: { key: string; name: string; text?: string[]; word?: string[] }[] = [
  { key: 'tiktok', name: '틱톡 (TikTok Shorts/바이럴)', text: ['tiktok'], word: ['tt'] },
  { key: 'facebook', name: '페이스북 (외국인 커뮤니티 그룹)', text: ['facebook', 'meta'], word: ['fb'] },
  { key: 'zalo', name: '잘로 (Zalo 베트남 메신저)', text: ['zalo'] },
  { key: 'line', name: '라인 (LINE 태국/동남아 채널)', text: ['line'] },
  { key: 'telegram', name: '텔레그램 (Telegram 우즈벡/러시아어)', text: ['telegram'], word: ['tg'] },
  { key: 'wechat', name: '위챗 (WeChat 동포 네트워크)', text: ['wechat'], word: ['wx'] },
  { key: 'youtube', name: '유튜브 (YouTube 한국생활 쇼츠)', text: ['youtube'], word: ['yt'] },
  { key: 'threads', name: '스레드 (Threads)', text: ['threads'] },
  { key: 'instagram', name: '인스타그램 (Instagram 릴스)', text: ['instagram', 'insta'], word: ['ig'] },
  { key: 'offline_qr', name: '기숙사/쉼터 QR코드 오프라인', text: ['qr', 'dormitory', 'shelter'] },
  { key: 'kakaotalk', name: '카카오톡 (오픈채팅/알림톡)', text: ['kakao', 'talk'] },
  { key: 'google', name: '구글 (Google 다국어 검색)', text: ['google', 'adwords'], word: ['gads'] },
  { key: 'naver', name: '네이버 (블로그/카페)', text: ['naver'] },
  { key: 'eps_gov', name: '고용노동부 EPS 게시판', text: ['eps', 'gov', 'hikorea'] },
  { key: 'referral', name: '지인 초대 (친구추천 링크)', text: ['invite', 'friend', 'referral'] },
];

// 이전 주소(referrer)에 들어 있는 도메인으로 판별
const REFERRER_RULES: { key: string; name: string; hosts: string[] }[] = [
  { key: 'tiktok', name: '틱톡 (TikTok Shorts/바이럴)', hosts: ['tiktok.com'] },
  { key: 'facebook', name: '페이스북 (외국인 커뮤니티 그룹)', hosts: ['facebook.com', 'fb.com', 'fb.me'] },
  { key: 'zalo', name: '잘로 (Zalo 베트남 메신저)', hosts: ['zalo.me'] },
  { key: 'line', name: '라인 (LINE 태국/동남아 채널)', hosts: ['line.me'] },
  { key: 'telegram', name: '텔레그램 (Telegram 우즈벡/러시아어)', hosts: ['t.me', 'telegram.org'] },
  { key: 'threads', name: '스레드 (Threads)', hosts: ['threads.com', 'threads.net'] },
  { key: 'instagram', name: '인스타그램 (Instagram 릴스)', hosts: ['instagram.com'] },
  { key: 'youtube', name: '유튜브 (YouTube 한국생활 쇼츠)', hosts: ['youtube.com', 'youtu.be'] },
  { key: 'google', name: '구글 (Google 다국어 검색)', hosts: ['google.com', 'google.co.kr'] },
  { key: 'naver', name: '네이버 (블로그/카페)', hosts: ['naver.com'] },
  { key: 'eps_gov', name: '고용노동부 EPS 게시판', hosts: ['eps.go.kr', 'hikorea.go.kr', 'moel.go.kr'] },
];

function detectChannel(params: URLSearchParams, utmSource: string, referrer: string): Channel {
  const tokens = utmSource.split(/[^a-z0-9]+/).filter(Boolean);

  for (const r of UTM_RULES) {
    if (r.text?.some((t) => utmSource.includes(t)) || r.word?.some((w) => tokens.includes(w))) {
      return { key: r.key, name: r.name };
    }
  }

  // UTM 이 없을 때: 광고 클릭 ID 로 식별
  if (!utmSource) {
    if (params.has('ttclid')) return { key: 'tiktok', name: UTM_RULES[0].name };
    if (params.has('fbclid')) return { key: 'facebook', name: UTM_RULES[1].name };
    if (params.has('gclid')) return { key: 'google', name: UTM_RULES.find((r) => r.key === 'google')!.name };
  }

  // 이전 주소(referrer)로 판별 (UTM 이 있는데 알 수 없는 값이면 이쪽으로 이어짐)
  if (!utmSource || referrer) {
    let host = '';
    try {
      host = referrer ? new URL(referrer).hostname.toLowerCase() : '';
    } catch {
      host = '';
    }
    if (host) {
      const hit = REFERRER_RULES.find((r) => r.hosts.some((h) => host === h || host.endsWith('.' + h)));
      if (hit) return { key: hit.key, name: hit.name };
      // 우리 사이트끼리 이동은 외부 유입이 아님
      if (host.endsWith('vercel.app') && host.includes('telecom')) return { key: 'direct', name: '직접 방문 (Direct / 북마크)' };
      return { key: 'other', name: '기타 타사이트 유입' };
    }
  }

  return { key: 'direct', name: '직접 방문 (Direct / 북마크)' };
}

/** 브라우저에 저장되는 익명 방문자 ID (개인정보 없음). 저장소를 쓸 수 없으면 ID 없이 기록 */
function getVisitorId(): string | undefined {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export default function TrafficTracker() {
  useEffect(() => {
    try {
      const last = sessionStorage.getItem(SESSION_KEY);
      const now = Date.now();
      if (last && now - parseInt(last, 10) < SESSION_GAP_MS) return;
      sessionStorage.setItem(SESSION_KEY, String(now));
    } catch {
      // 저장소를 못 쓰면 매번 기록 (드물게 중복될 수 있음)
    }

    const params = new URLSearchParams(window.location.search);
    const utmSource = (params.get('utm_source') || params.get('source') || params.get('ref') || '').toLowerCase();
    const referrer = document.referrer ? document.referrer.toLowerCase() : '';
    const channel = detectChannel(params, utmSource, referrer);

    fetch('/api/traffic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelKey: channel.key,
        channelName: channel.name,
        sourceUrl: window.location.href,
        utmSource: utmSource || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        referrer: referrer || undefined,
        visitorId: getVisitorId(),
      }),
      keepalive: true,
    }).catch(() => {
      // 오프라인이거나 실패해도 사용자 화면에는 영향 없음
    });
  }, []);

  return null;
}
