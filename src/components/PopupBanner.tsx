'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import SmartLink from '@/components/SmartLink';
import { themeOf } from '@/lib/content/themes';
import type { Banner } from '@/lib/content/types';
import { t } from '@/lib/i18n';

/** 홈 진입 시 뜨는 팝업. '오늘 하루 보지 않기'를 누르면 자정까지 숨김 (팝업마다 따로 기억) */
export default function PopupBanner({ banner }: { banner?: Banner }) {
  const [open, setOpen] = useState(false);
  const storageKey = banner ? `ktelecom_popup_hidden_until_${banner.id}` : '';

  useEffect(() => {
    if (!banner) return;
    try {
      const until = Number(localStorage.getItem(storageKey) ?? 0);
      if (Date.now() > until) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [banner, storageKey]);

  const hideToday = () => {
    try {
      const end = new Date();
      end.setHours(24, 0, 0, 0);
      localStorage.setItem(storageKey, String(end.getTime()));
    } catch {
      /* 저장소를 못 쓰는 환경이면 이번 방문에서만 닫는다 */
    }
    setOpen(false);
  };

  if (!banner || !open) return null;
  const theme = themeOf(banner.theme);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" aria-label={t('공지 팝업')}>
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        {banner.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner.image_url} alt="" className="max-h-72 w-full object-cover" />
        )}
        <div className={`bg-gradient-to-br ${theme.bg} p-8 text-white`}>
          {banner.eyebrow && <p className="text-xs font-bold tracking-[0.25em] text-white/70">{banner.eyebrow}</p>}
          <h2 className="mt-3 whitespace-pre-line text-2xl font-black leading-snug">{banner.title}</h2>
          {banner.description && <p className="mt-3 text-sm text-white/75">{banner.description}</p>}
          {banner.link_url && banner.button_label && (
            <SmartLink
              href={banner.link_url}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex rounded-md bg-white px-6 py-2.5 text-xs font-extrabold text-ink"
            >
              {banner.button_label}
            </SmartLink>
          )}
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
