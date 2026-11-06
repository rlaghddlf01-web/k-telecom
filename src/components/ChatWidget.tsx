'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Download, Loader2, MessageCircle, MessageSquareText, Send, Send as TelegramIcon, X } from 'lucide-react';
import { useLang, useT } from '@/components/LangProvider';

interface Channel {
  id: 'whatsapp' | 'telegram' | 'messenger' | 'kakao';
  label: string;
  href: string;
}

interface Props {
  managerName: string;
  managerRole: string;
  intro: string;
  avatar: string;
  aiEnabled: boolean;
  channels: Channel[];
}

interface Msg {
  role: 'user' | 'model';
  text: string;
}

const CHANNEL_STYLE: Record<Channel['id'], string> = {
  whatsapp: 'bg-[#22c55e] hover:bg-[#16a34a]',
  telegram: 'bg-[#229ed9] hover:bg-[#1b86ba]',
  messenger: 'bg-[#0084ff] hover:bg-[#006fd6]',
  kakao: 'bg-[#fee500] text-[#191919] hover:bg-[#f5dc00]',
};

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/** 오른쪽 아래 상담 창: 매니저 소개 → AI 실시간 채팅 / 왓츠앱·텔레그램·메신저·카카오톡 / 앱 설치 */
export default function ChatWidget({ managerName, managerRole, intro, avatar, aiEnabled, channels }: Props) {
  const t = useT();
  const lang = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'home' | 'chat'>('home');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [installed, setInstalled] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    setInstalled(window.matchMedia('(display-mode: standalone)').matches);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy, view]);

  if (pathname.startsWith('/admin')) return null;

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      setInstallEvent(null);
    } else {
      setShowGuide((v) => !v);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: 'user', text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages.slice(-10), lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data.answer === 'string') {
        setMessages([...next, { role: 'model', text: data.answer }]);
      } else if (res.status === 429) {
        setMessages([...next, { role: 'model', text: t('잠시 후 다시 시도해 주세요.') }]);
      } else {
        setFailed(true);
        setMessages([...next, { role: 'model', text: t('지금은 AI 상담을 쓸 수 없습니다. 아래 버튼으로 문의해 주세요.') }]);
      }
    } catch {
      setFailed(true);
      setMessages([...next, { role: 'model', text: t('지금은 AI 상담을 쓸 수 없습니다. 아래 버튼으로 문의해 주세요.') }]);
    } finally {
      setBusy(false);
    }
  }

  const channelButtons = (
    <div className="space-y-2.5">
      {channels.map((c) => (
        <a
          key={c.id}
          href={c.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white transition-colors ${CHANNEL_STYLE[c.id]}`}
        >
          {c.id === 'telegram' ? <TelegramIcon className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
          {c.label}
        </a>
      ))}
    </div>
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-4 z-30 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-amber-500 text-white shadow-xl transition-transform hover:scale-105 md:bottom-8 md:right-8"
        aria-label={t('상담하기')}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="mt-0.5 text-[10px] font-extrabold">{t('상담하기')}</span>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={managerName}
      className="fixed inset-x-3 bottom-3 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-3xl border border-amber-400/60 bg-[#0f1424] text-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px]"
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-4">
        {view === 'chat' ? (
          <button onClick={() => setView('home')} aria-label={t('뒤로')} className="rounded-full bg-white/10 p-1.5 hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> {t('상담 가능')}
          </span>
        )}
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(false)} className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/30">
            {t('숨기기')}
          </button>
          <button onClick={() => setOpen(false)} aria-label={t('닫기')} className="rounded-full bg-white/10 p-1.5 hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === 'home' ? (
        <div className="overflow-y-auto px-5 pb-5 pt-3 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-amber-500 ring-4 ring-amber-400/40">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <MessageSquareText className="h-9 w-9 text-white" />
            )}
          </span>
          <p className="mx-auto mt-2 inline-block rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-bold text-white/70">{managerRole}</p>
          <h2 className="mt-2 text-xl font-black">{managerName}</h2>
          <p className="mt-2 text-sm font-semibold text-amber-300">{intro}</p>
          <p className="mx-auto mt-3 rounded-xl bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-white/75 ring-1 ring-white/10">
            {t('모국어로 편하게 대화하세요. AI 매니저가 내 나라 말로 바로 답해 드립니다.')}
          </p>

          <div className="mt-4 space-y-2.5">
            {aiEnabled && (
              <button
                onClick={() => {
                  setView('chat');
                  if (messages.length === 0) setMessages([{ role: 'model', text: t('안녕하세요! 무엇이든 물어보세요. 요금제, 단말, 가입 방법을 안내해 드립니다.') }]);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-sm font-extrabold text-[#0f1424] hover:from-amber-400 hover:to-amber-300"
              >
                <MessageSquareText className="h-4 w-4" /> {t('지금 실시간으로 매니저에게 문의하기')}
              </button>
            )}
            {channelButtons}
            {!installed && (
              <button
                onClick={install}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-500"
              >
                <Download className="h-4 w-4" /> {t('내 휴대폰에 앱 설치하기')}
              </button>
            )}
            {showGuide && !installed && (
              <p className="rounded-xl bg-white/10 px-3 py-2.5 text-left text-xs leading-relaxed text-white/80">
                <b className="block text-white">{t('앱 설치 안내')}</b>
                {t("안드로이드는 크롬 메뉴에서, 아이폰은 공유 버튼을 누르고 '홈 화면에 추가'를 선택해 주세요.")}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-3 px-4 pb-3 pt-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-500">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <MessageSquareText className="h-4 w-4 text-white" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{managerName}</p>
              <p className="text-[11px] text-emerald-400">{t('상담 가능')}</p>
            </div>
          </div>

          <div className="min-h-[220px] flex-1 space-y-2.5 overflow-y-auto bg-black/20 px-4 py-3" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-amber-500 text-[#0f1424]' : 'bg-white/10 text-white'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {busy && (
              <p className="flex items-center gap-2 text-xs text-white/60">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t('답변을 준비하고 있어요...')}
              </p>
            )}
            {failed && channels.length > 0 && <div className="pt-1">{channelButtons}</div>}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="border-t border-white/10 p-3"
          >
            <p className="mb-2 text-[10px] leading-snug text-white/45">{t('채팅에는 비밀번호, 카드번호, 외국인등록번호 같은 개인정보를 입력하지 마세요.')}</p>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={600}
                placeholder={t('메시지를 입력하세요')}
                className="min-w-0 flex-1 rounded-xl bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t('보내기')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-[#0f1424] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
