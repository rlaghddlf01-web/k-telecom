'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { t } from '@/lib/i18n';

/** 오른쪽 아래 고정 상담 버튼 (관리자 화면에서는 숨김) */
export default function FloatingChat() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <Link
      href="/support/inquiry"
      className="fixed bottom-5 right-4 z-30 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-amber-500 text-white shadow-xl transition-transform hover:scale-105 md:bottom-8 md:right-8"
      aria-label={t('상담하기')}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="mt-0.5 text-[10px] font-extrabold">{t('상담하기')}</span>
    </Link>
  );
}
