'use client';

import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';
import { t } from '@/lib/i18n';

/** 홈 최상단 띠 배너 (닫기 가능) */
export default function PromoStrip() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#1b1550] to-brand text-white">
      <Link href="/events" className="mx-auto block max-w-7xl px-10 py-2.5 text-center text-xs font-bold md:text-sm">
        {t('오픈 기념 · 갤럭시 A시리즈 0원폰과 원룸 인터넷 사은품 이벤트 보기')} &rarr;
      </Link>
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
