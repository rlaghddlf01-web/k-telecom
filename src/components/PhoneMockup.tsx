import { useId } from 'react';

export type PhoneKind = 'punch' | 'island' | 'back';

export interface PhoneMockupProps {
  kind?: PhoneKind;
  from?: string;
  to?: string;
  className?: string;
}

/**
 * 폰 목업(SVG). 실제 제품 사진이 준비되기 전까지 상품 이미지 자리를 채웁니다.
 * 사진을 넣을 때는 ProductImage 컴포넌트의 image 값만 지정하면 됩니다.
 */
export default function PhoneMockup({
  kind = 'punch',
  from = '#6d5dfc',
  to = '#e8174f',
  className = '',
}: PhoneMockupProps) {
  const uid = useId().replace(/:/g, '');
  const wall = `wall-${uid}`;
  const glass = `glass-${uid}`;
  const frame = `frame-${uid}`;
  const clip = `clip-${uid}`;

  return (
    <svg viewBox="0 0 220 440" className={`overflow-visible ${className}`} role="img" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <rect x="18" y="14" width="184" height="412" rx="31" />
        </clipPath>
        <linearGradient id={wall} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={frame} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3f52" />
          <stop offset="0.5" stopColor="#12141d" />
          <stop offset="1" stopColor="#2b2f40" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 측면 버튼 */}
      <rect x="6" y="104" width="4" height="34" rx="2" fill="#2b2f40" />
      <rect x="6" y="150" width="4" height="52" rx="2" fill="#2b2f40" />
      <rect x="210" y="130" width="4" height="64" rx="2" fill="#2b2f40" />

      {kind === 'back' ? (
        <>
          <rect x="10" y="6" width="200" height="428" rx="38" fill={`url(#${wall})`} />
          <rect x="10" y="6" width="200" height="428" rx="38" fill={`url(#${glass})`} />
          <rect x="10" y="6" width="200" height="428" rx="38" fill="none" stroke="#fff" strokeOpacity="0.25" />
          <rect x="26" y="24" width="74" height="84" rx="22" fill="#0d0f17" fillOpacity="0.78" />
          {[[48, 46], [48, 86], [78, 66]].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="13" fill="#1b1e2b" stroke="#4a4f66" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="7" fill="#07080d" />
              <circle cx={cx - 2.5} cy={cy - 2.5} r="2" fill="#7f86ff" fillOpacity="0.8" />
            </g>
          ))}
          <circle cx="86" cy="36" r="4" fill="#f5f0c8" fillOpacity="0.9" />
        </>
      ) : (
        <>
          <rect x="10" y="6" width="200" height="428" rx="38" fill={`url(#${frame})`} />
          <rect x="18" y="14" width="184" height="412" rx="31" fill={`url(#${wall})`} />
          {/* 월페이퍼 장식 (화면 영역으로 자름) */}
          <g clipPath={`url(#${clip})`}>
            <circle cx="170" cy="90" r="70" fill="#fff" fillOpacity="0.14" />
            <circle cx="40" cy="330" r="90" fill="#000" fillOpacity="0.14" />
            <path d="M18 260 C 70 220, 130 300, 202 250 L202 426 L18 426 Z" fill="#fff" fillOpacity="0.1" />
            <path d="M18 300 C 80 270, 140 340, 202 300 L202 426 L18 426 Z" fill="#000" fillOpacity="0.12" />
          </g>
          {/* 상태바 */}
          <text x="36" y="42" fontSize="11" fontWeight="700" fill="#fff">9:41</text>
          <rect x="164" y="33" width="20" height="9" rx="2.5" fill="none" stroke="#fff" strokeOpacity="0.9" />
          <rect x="166" y="35" width="14" height="5" rx="1.5" fill="#fff" />
          {/* 카메라 */}
          {kind === 'island' ? (
            <rect x="82" y="24" width="56" height="17" rx="8.5" fill="#05060a" />
          ) : (
            <circle cx="110" cy="33" r="5.5" fill="#05060a" />
          )}
          {/* 시계 */}
          <text x="110" y="150" textAnchor="middle" fontSize="54" fontWeight="300" fill="#fff">9:41</text>
          <text x="110" y="176" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff" fillOpacity="0.85">서울 · 맑음 24°</text>
          {/* 앱 아이콘 */}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={36 + i * 40} y="352" width="30" height="30" rx="9" fill="#fff" fillOpacity={0.88 - i * 0.14} />
          ))}
          <rect x="82" y="410" width="56" height="4" rx="2" fill="#fff" fillOpacity="0.9" />
          <rect x="18" y="14" width="184" height="412" rx="31" fill={`url(#${glass})`} />
          <rect x="18" y="14" width="184" height="412" rx="31" fill="none" stroke="#fff" strokeOpacity="0.12" />
        </>
      )}
    </svg>
  );
}
