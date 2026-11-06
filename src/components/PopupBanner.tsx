'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { t } from '@/lib/i18n';

const KEY = 'ktelecom_popup_hidden_until';

/** 홈 진입 시 뜨는 팝업. '오늘 하루 보지 않기'를 누르면 자정까지 숨김 */
export default function PopupBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem(KEY) ?? 0);
      if (Date.now() > until) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const hideToday = () => {
    try {
      const end = new Date();
      end.setHours(24, 0, 0, 0);
      localStorage.setItem(KEY, String(end.getTime()));
    } catch {
      /* 저장소를 못 쓰는 환경이면 이번 방문에서만 닫는다 */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={t('공지 팝업')}>
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-[#1b1550] via-[#3b1670] to-brand p-8 text-white">
          <p className="text-xs font-bold tracking-[0.25em] text-white/70">{t('오픈 기념 혜택')}</p>
          <h2 className="mt-3 whitespace-pre-line text-2xl font-black leading-snug">{t('기기값 0원\n24개월 분할')}</h2>
          <p className="mt-3 text-sm text-white/75">{t('외국인등록증만 있으면 신용카드 없이 단말 할부 가능')}</p>
          <Link
            href="/events/galaxy-zero"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex rounded-md bg-white px-6 py-2.5 text-xs font-extrabold text-ink"
          >
            {t('자세히 보기')}
          </Link>
        </div>
        <div className="flex">
          <button onClick={hideToday} className="flex-1 border-r border-black/10 py-3.5 text-xs font-bold text-slate-500 hover:bg-soft">
            {t('오늘 하루 보지 않기')}
          </button>
          <button onClick={() => setOpen(false)} className="flex flex-1 items-center justify-center gap-1 py-3.5 text-xs font-bold hover:bg-soft">
            {t('닫기')} <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
