'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import SmartLink from '@/components/SmartLink';
import { themeOf } from '@/lib/content/themes';
import type { Banner } from '@/lib/content/types';
import { t } from '@/lib/i18n';

/** 홈 최상단 띠 배너 (닫기 가능). 관리자의 [상단 띠배너]에서 수정 */
export default function PromoStrip({ banner }: { banner?: Banner }) {
  const [open, setOpen] = useState(true);
  if (!banner || !open) return null;

  const content = <>{banner.title} {banner.link_url && <>&rarr;</>}</>;

  return (
    <div className={`relative bg-gradient-to-r ${themeOf(banner.theme).bg} text-white`}>
      {banner.link_url ? (
        <SmartLink href={banner.link_url} className="mx-auto block max-w-7xl px-10 py-2.5 text-center text-xs font-bold md:text-sm">
          {content}
        </SmartLink>
      ) : (
        <p className="mx-auto max-w-7xl px-10 py-2.5 text-center text-xs font-bold md:text-sm">{content}</p>
      )}
      <button
        onClick={() => setOpen(false)}
        aria-label={t('닫기')}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/15"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
