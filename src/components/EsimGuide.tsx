'use client';

import { useState } from 'react';
import { useT } from '@/components/LangProvider';

const GUIDES = {
  ios: {
    label: 'iOS 휴대폰',
    steps: [
      '설정 > 셀룰러(모바일 데이터) > eSIM 추가를 엽니다.',
      '안내받은 QR 코드를 카메라로 스캔합니다.',
      '화면 안내에 따라 요금제 이름을 정하고 활성화를 마칩니다.',
      '기본 회선과 데이터 회선을 선택합니다.',
    ],
  },
  android: {
    label: 'Android 휴대폰',
    steps: [
      '설정 > 연결 > SIM 관리자 > eSIM 추가를 엽니다.',
      '안내받은 QR 코드를 스캔합니다.',
      '화면 안내에 따라 활성화를 마칩니다.',
      '휴대폰을 재부팅한 뒤 통신 연결을 확인합니다.',
    ],
  },
} as const;

export default function EsimGuide() {
  const t = useT();
  const [os, setOs] = useState<keyof typeof GUIDES>('ios');

  return (
    <div>
      <div className="flex gap-2">
        {(Object.keys(GUIDES) as (keyof typeof GUIDES)[]).map((k) => (
          <button
            key={k}
            onClick={() => setOs(k)}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-colors ${
              os === k ? 'bg-brand text-white shadow-md shadow-brand/30' : 'bg-soft text-slate-600 hover:text-brand'
            }`}
          >
            {t(GUIDES[k].label)}
          </button>
        ))}
      </div>

      <ol className="mt-5 grid gap-4 sm:grid-cols-2">
        {GUIDES[os].steps.map((s, i) => (
          <li key={s} className="rounded-2xl border border-black/5 p-5 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-black text-white">
              {i + 1}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(s)}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-slate-400">{t('기종과 운영체제 버전에 따라 메뉴 이름이 다를 수 있습니다.')}</p>
    </div>
  );
}
