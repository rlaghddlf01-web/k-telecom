'use client';

import type { ReactNode } from 'react';

export const OPEN_CHAT_EVENT = 'ktel:open-chat';

/** 누르면 화면 오른쪽 아래 상담 채팅(매니저)을 바로 연다 */
export default function OpenChatButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}>
      {children}
    </button>
  );
}
