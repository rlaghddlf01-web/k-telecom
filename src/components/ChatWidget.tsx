'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from '@/components/LocaleLink';
import { ArrowLeft, ChevronRight, Download, Globe, Loader2, MessageCircle, MessageSquareText, Send, Send as TelegramIcon, X } from 'lucide-react';
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
  teaser: string;
  avatar: string;
  aiEnabled: boolean;
  phone: string;
  channels: Channel[];
}

interface Msg {
  role: 'user' | 'model';
  text: string;
}

const CHANNEL_STYLE: Record<Channel['id'], string> = {
  whatsapp: 'bg-[#25c25a] text-white',
  telegram: 'bg-[#1d93d6] text-white',
  messenger: 'bg-pill text-white',
  kakao: 'bg-[#fee500] text-[#191919]',
};

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/** 오른쪽 아래 상담 창: 매니저 소개 → AI 실시간 채팅 / 왓츠앱·텔레그램·메신저·카카오톡 / 앱 설치 */
export default function ChatWidget({ managerName, managerRole, intro, teaser, avatar, aiEnabled, phone, channels }: Props) {
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
  const [teaserOpen, setTeaserOpen] = useState(false);
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

  // 닫혀 있을 때 잠시 뒤에 말풍선을 띄운다 (한 번 닫으면 이번 방문 동안 다시 띄우지 않는다)
  useEffect(() => {
    let closed = false;
    try {
      closed = sessionStorage.getItem('kt_chat_teaser_closed') === '1';
    } catch {
      /* 저장소를 못 쓰면 그냥 보여 준다 */
    }
    if (closed) return;
    const timer = setTimeout(() => setTeaserOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const closeTeaser = () => {
    setTeaserOpen(false);
    try {
      sessionStorage.setItem('kt_chat_teaser_closed', '1');
    } catch {
      /* 무시 */
    }
  };

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
        setMessages([...next, { role: 'model', text: t('지금은 상담 연결이 원활하지 않습니다. 아래 버튼으로 문의해 주세요.') }]);
      }
    } catch {
      setFailed(true);
      setMessages([...next, { role: 'model', text: t('지금은 상담 연결이 원활하지 않습니다. 아래 버튼으로 문의해 주세요.') }]);
    } finally {
      setBusy(false);
    }
  }

  const channelButtons = (
    <div className="space-y-2">
      {channels.map((c) => {
        const cls =
          'group flex w-full items-center gap-3 rounded-full border border-black/10 bg-white py-2 pl-2 pr-4 text-left text-sm font-bold text-ink shadow-sm transition-colors hover:border-brand/40 hover:bg-soft';
        const inner = (
          <>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${CHANNEL_STYLE[c.id]}`}>
              {c.id === 'telegram' ? <TelegramIcon className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
            </span>
            <span className="min-w-0 flex-1 truncate">{c.label}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand" />
          </>
        );
        // 아직 연결 전인 메신저(사이트 안 주소)는 같은 창에서 상담문의 페이지로 이동한다
        return c.href.startsWith('/') ? (
          <Link key={c.id} href={c.href} onClick={() => setOpen(false)} className={cls}>
            {inner}
          </Link>
        ) : (
          <a key={c.id} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
            {inner}
          </a>
        );
      })}
    </div>
  );

  const avatarCircle = (size: string, icon: string) => (
    <span className="relative block shrink-0">
      <span className={`flex ${size} items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand to-pill ring-2 ring-white`}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <MessageSquareText className={`${icon} text-white`} />
        )}
      </span>
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
    </span>
  );

  if (!open) {
    return (
      <div className="fixed bottom-4 right-3 z-30 flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2.5 md:bottom-6 md:right-6">
        {teaserOpen && (
          <div className="relative w-[300px] max-w-full rounded-2xl bg-white p-3.5 pr-8 text-left shadow-[0_16px_40px_-12px_rgba(15,20,36,0.35)] ring-1 ring-black/5">
            <button onClick={closeTeaser} aria-label={t('닫기')} className="absolute right-2.5 top-2.5 rounded-full p-0.5 text-slate-400 hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                closeTeaser();
                setOpen(true);
              }}
              className="block w-full text-left"
            >
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-brand">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate">
                  {managerName} · {t('실시간 안내')}
                </span>
              </span>
              <span className="mt-1.5 block text-xs font-semibold leading-relaxed text-slate-700">{teaser}</span>
            </button>
          </div>
        )}
        <button
          onClick={() => {
            closeTeaser();
            setOpen(true);
          }}
          className="flex max-w-full items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 text-left shadow-[0_12px_30px_-8px_rgba(15,20,36,0.4)] ring-1 ring-black/10 transition-transform hover:scale-[1.03]"
          aria-label={managerName}
        >
          {avatarCircle('h-11 w-11', 'h-5 w-5')}
          <span className="min-w-0">
            <span className="block truncate text-[10px] font-bold text-brand">{managerRole}</span>
            <span className="block truncate text-sm font-black text-ink">
              {managerName} · {t('상담하기')}
            </span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={managerName}
      className="fixed inset-x-3 bottom-3 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-[0_24px_60px_-12px_rgba(15,20,36,0.5)] ring-1 ring-black/10 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[390px]"
    >
      {/* 위쪽 배너: 사이트 페이지 제목 배너와 같은 남색~보라 그라데이션 */}
      <div className="shrink-0 bg-gradient-to-r from-navy via-[#1b1550] to-[#3b1670] px-5 pb-5 pt-4 text-white">
        <div className="flex items-center justify-between gap-2">
          {view === 'chat' ? (
            <button onClick={() => setView('home')} aria-label={t('뒤로')} className="rounded-full bg-white/15 p-1.5 hover:bg-white/25">
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {t('상담 가능')}
            </span>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(false)} className="rounded-full border border-white/30 px-3.5 py-1 text-xs font-bold text-white/85 hover:bg-white/15">
              {t('숨기기')}
            </button>
            <button onClick={() => setOpen(false)} aria-label={t('닫기')} className="rounded-full bg-white/15 p-1.5 hover:bg-white/25">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3.5">
          {avatarCircle(view === 'home' ? 'h-16 w-16' : 'h-11 w-11', view === 'home' ? 'h-7 w-7' : 'h-5 w-5')}
          <div className="min-w-0">
            <p className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white/85">{managerRole}</p>
            <h2 className={`truncate font-black leading-tight ${view === 'home' ? 'mt-1 text-xl' : 'mt-0.5 text-base'}`}>{managerName}</h2>
            {view === 'home' && phone && <p className="mt-0.5 text-xs font-semibold text-white/60">Official Center {phone}</p>}
          </div>
        </div>
      </div>

      {view === 'home' ? (
        <div className="overflow-y-auto px-5 pb-5 pt-4">
          <p className="text-[15px] font-extrabold leading-snug text-ink">{intro}</p>
          <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-soft px-3.5 py-3">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-pill" />
            <p className="text-xs font-semibold leading-relaxed text-slate-600">
              {t('모국어로 편하게 대화하세요. 매니저가 내 나라 말로 바로 답해 드립니다.')}
            </p>
          </div>

          <div className="mt-4 space-y-2.5">
            {aiEnabled && (
              <button
                onClick={() => {
                  setView('chat');
                  if (messages.length === 0) setMessages([{ role: 'model', text: t('안녕하세요! 무엇이든 물어보세요. 요금제, 단말, 가입 방법을 안내해 드립니다.') }]);
                }}
                className="flex w-full items-center gap-2.5 rounded-full bg-brand py-2.5 pl-2.5 pr-4 text-sm font-extrabold text-white shadow-md shadow-brand/30 transition-colors hover:bg-brand-dark"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <MessageSquareText className="h-4 w-4" />
                </span>
                <span className="flex-1 text-left">{t('지금 실시간으로 매니저에게 문의하기')}</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            )}
            {channelButtons}
            {!installed && (
              <button
                onClick={install}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-ink"
              >
                <Download className="h-4 w-4" /> {t('내 휴대폰에 앱 설치하기')}
              </button>
            )}
            {showGuide && !installed && (
              <p className="rounded-2xl bg-soft px-3.5 py-3 text-left text-xs leading-relaxed text-slate-600">
                <b className="block text-ink">{t('앱 설치 안내')}</b>
                {t("안드로이드는 크롬 메뉴에서, 아이폰은 공유 버튼을 누르고 '홈 화면에 추가'를 선택해 주세요.")}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-[240px] flex-1 space-y-2.5 overflow-y-auto bg-soft px-4 py-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-2xl rounded-br-md bg-brand text-white'
                      : 'rounded-2xl rounded-bl-md bg-white text-ink shadow-sm ring-1 ring-black/5'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {busy && (
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" /> {t('답변을 준비하고 있어요...')}
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
            className="shrink-0 border-t border-black/5 bg-white p-3"
          >
            <p className="mb-2 text-[10px] leading-snug text-slate-400">{t('채팅에는 비밀번호, 카드번호, 외국인등록번호 같은 개인정보를 입력하지 마세요.')}</p>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={600}
                placeholder={t('메시지를 입력하세요')}
                className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-brand"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t('보내기')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
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