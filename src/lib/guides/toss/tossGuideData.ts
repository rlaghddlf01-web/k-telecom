/**
 * 토스 인증서 가이드 데이터. 하나·카카오·PASS 가이드와 같은 구조입니다:
 * 화면 사진 + 누를 곳 점선 박스(x, y = 박스 중심 %, width, height = 박스 크기 %) + 말풍선(label).
 * 말풍선(label)은 토스 앱 화면에 보이는 버튼 글자 그대로라 번역하지 않습니다.
 * 슬라이드 아래 설명(title/body/note)은 tossGuideTexts.ts의 15개 언어 문구입니다.
 * 기본으로 켜져 있습니다. 끄려면 환경변수 NEXT_PUBLIC_TOSS_GUIDE=0 (Vercel에서 넣고 재배포).
 */

import type { TossTextKey } from './tossGuideTexts';
import type { TossNoteKey } from './tossGuideNotes';

export const TOSS_GUIDE_ENABLED = process.env.NEXT_PUBLIC_TOSS_GUIDE !== '0';

export interface TossMarker {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 말풍선 글자 (앱 화면의 버튼 이름 그대로) */
  label?: string;
  /** 아직 누르면 안 되는 곳 (빨간색) */
  warn?: boolean;
}

export interface TossSlide {
  image: string;
  title: TossTextKey;
  body: TossTextKey;
  note?: TossTextKey | TossNoteKey;
  /** 사진 위 말풍선 문구 (b0, b1, ... 슬라이드 순서와 같음) */
  bubble: TossTextKey;
  markers: TossMarker[];
  /** TOSS_CHAPTERS 의 번호 */
  chapter: number;
  /** 설명용 합성 그림이 섞인 슬라이드 */
  hasSample?: boolean;
}

export interface TossChapter {
  title: TossTextKey;
  icon: string;
  /** 이 챕터가 시작하는 슬라이드 번호 */
  start: number;
}

const img = (name: string) => `/images/guide/toss/${name}.jpg`;
const m = (x: number, y: number, width: number, height: number, label?: string, warn?: boolean): TossMarker => ({ x, y, width, height, label, warn });

const SLIDES: Omit<TossSlide, 'chapter' | 'bubble'>[] = [
  // ── 앱 설치 ──
  { image: img('01_play_install'), title: 's1t', body: 's1b', markers: [m(50, 69.5, 88, 5.5, 'Install')] },
  { image: img('02_play_installing'), title: 's1t', body: 's1b', markers: [m(73, 27, 42, 6, 'Open')] },
  { image: img('03_language_picker'), title: 's2t', body: 's2b', markers: [m(45, 17, 84, 6, 'English'), m(50, 87.8, 84, 6.5, '확인')] },
  { image: img('03a_nationality'), title: 's3t', body: 's3b', markers: [m(48, 38.5, 88, 8, 'Another nationality')] },
  { image: img('03b_korean_id_question'), title: 's3t', body: 's3b', markers: [m(48, 25.5, 88, 6.5, 'Yes')] },
  // ── 본인 확인 ──
  { image: img('08_registration_number'), title: 's4t', body: 's4b', note: 's4n', markers: [m(49, 33, 86, 6, 'ID number'), m(27, 40, 44, 5, 'Phone'), m(48, 49.5, 85, 6, 'Next')] },
  { image: img('09_carrier_popup'), title: 's5t', body: 's5b', markers: [m(50, 66, 85, 42, 'Your carrier')] },
  { image: img('10_enter_name'), title: 's6t', body: 's6b', note: 's6n', markers: [m(48, 25, 90, 7, 'Name')] },
  { image: img('11_double_check_name'), title: 's6t', body: 's6b', note: 's6n', markers: [m(74, 52.4, 28, 6, 'Confirm'), m(50, 87.5, 84, 6.5, 'Verify identity')] },
  { image: img('07_signup_terms'), title: 's7t', body: 's7b', markers: [m(50, 81.3, 88, 6.5, 'Agree and verify identity')] },
  { image: img('12_sms_code'), title: 's8t', body: 's8b', markers: [m(47, 31, 84, 9, '6-digit code'), m(48, 86.5, 84, 6, 'Confirm')] },
  { image: img('13_verify_method'), title: 's9t', body: 's9b', note: 's9n', markers: [m(50, 88, 88, 6.5, 'Verify with ₩1')] },
  { image: img('15_select_bank_en'), title: 's9t', body: 's9b', note: 's9n', markers: [m(50, 58, 92, 62, 'Your bank')] },
  { image: img('16_account_number'), title: 's9t', body: 's9b', note: 's9n', markers: [m(48, 27, 88, 7, 'Account number'), m(48, 50, 84, 7, 'Confirm')] },
  { image: img('17_won1_sent'), title: 's10t', body: 's10b', markers: [m(50, 15, 88, 9, '₩1 sent')] },
  { image: img('17b_bank_app_won1_deposit'), title: 's10t', body: 's10b', markers: [m(17, 66, 30, 6, '토스 + 3 digits')] },
  // ── 인증서 만들기 ──
  { image: img('18_id_place'), title: 's11t', body: 's11b', markers: [m(50, 85.5, 88, 7, 'Take photo')] },
  { image: img('20b_id_camera_arc_sample'), title: 's11t', body: 's11b', hasSample: true, markers: [m(50, 56, 90, 27, 'ID card')] },
  { image: img('21_id_scanning'), title: 's11t', body: 's11b', markers: [m(50, 36, 62, 26, 'Scanning')] },
  { image: img('22_confirm_id_info'), title: 's11t', body: 's11b', note: 'idFieldsNote', markers: [m(70, 86, 40, 7, 'Yes')] },
  { image: img('23_issue_certificate_confirm'), title: 's12t', body: 's12b', note: 's12n', markers: [m(50, 80.5, 88, 7, 'Confirm')] },
  { image: img('24_certificate_pin'), title: 's12t', body: 's12b', note: 's12n', markers: [m(50, 66, 80, 38, '6-digit PIN')] },
  { image: img('25_certificate_pin_again'), title: 's12t', body: 's12b', note: 's12n', markers: [m(50, 66, 80, 38, 'PIN again')] },
  { image: img('26_successfully_issued'), title: 's13t', body: 's13b', markers: [m(52, 85.5, 88, 8, 'Issued')] },
  { image: img('27_my_toss_certificate'), title: 's13t', body: 's13b', markers: [m(60, 72.5, 64, 4.5, 'Valid until')] },
];

/** 슬라이드가 어느 챕터인지: 챕터 시작 번호 기준 */
const CHAPTER_STARTS: { title: TossTextKey; icon: string; start: number }[] = [
  { title: 'chInstall', icon: '📲', start: 0 },
  { title: 'chVerify', icon: '🪪', start: 5 },
  { title: 'chIssue', icon: '🔐', start: 16 },
];

export const TOSS_CHAPTERS: TossChapter[] = CHAPTER_STARTS;

export const TOSS_GUIDE_STEPS: TossSlide[] = SLIDES.map((s, i) => {
  let chapter = 0;
  CHAPTER_STARTS.forEach((c, ci) => { if (i >= c.start) chapter = ci; });
  return { ...s, chapter, bubble: `b${i}` as TossTextKey };
});

export const TOSS_REGISTRATION_END = 25;
