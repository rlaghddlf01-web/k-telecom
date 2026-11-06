'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/components/LangProvider';

/** 이번 달 말일 23:59:59까지 남은 시간 */
function remaining() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
  const diff = Math.max(0, end - now.getTime());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function DealCountdown({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const t = useT();
  const [left, setLeft] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    setLeft(remaining());
    const timer = setInterval(() => setLeft(remaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cell = tone === 'dark' ? 'bg-white/15 text-white' : 'bg-brand text-white';
  const items: [string, number | undefined][] = [
    ['일', left?.d],
    ['시', left?.h],
    ['분', left?.m],
    ['초', left?.s],
  ];

  return (
    <div className="flex items-center justify-center gap-2" aria-label={t('이번 달 남은 시간')}>
      {items.map(([unit, v]) => (
        <span key={unit} className={`rounded-md px-2.5 py-1.5 text-xs font-extrabold tabular-nums ${cell}`}>
          {v === undefined ? '--' : String(v).padStart(2, '0')}
          {t(unit)}
        </span>
      ))}
    </div>
  );
}
