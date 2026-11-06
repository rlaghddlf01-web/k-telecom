'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, X } from 'lucide-react';
import { useLang } from '@/components/LangProvider';
import { LANGS, flagUrl, localizePath, stripLang, type Lang } from '@/lib/langs';
import { WELCOME_TEXTS } from '@/lib/welcome';

const CHOSEN_KEY = 'kt_lang_chosen';
const OPEN_EVENT = 'kt:open-language';

/** 어디서든 언어 선택 창을 연다 (헤더의 언어 버튼이 사용) */
export const openLanguageGate = () => window.dispatchEvent(new Event(OPEN_EVENT));

function remember(code: Lang) {
  try {
    localStorage.setItem(CHOSEN_KEY, code);
  } catch {
    /* 저장소를 못 쓰는 환경이면 기억하지 않고 이동만 한다 */
  }
}

/** 언어 선택 화면. 처음 방문하면 한국어 주소(/)에서 자동으로 뜨고, 헤더의 언어 버튼으로 다시 열 수 있다 */
export default function LanguageGate({ standalone = false }: { standalone?: boolean }) {
  const current = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(standalone);
  const [hover, setHover] = useState<Lang>(current);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  useEffect(() => {
    if (standalone) return;
    try {
      const chosen = localStorage.getItem(CHOSEN_KEY);
      if (chosen) return;
      // 광고 등으로 /vi 같은 언어 주소에 바로 들어온 방문자는 이미 언어를 정한 것이다
      if (current !== 'ko') localStorage.setItem(CHOSEN_KEY, current);
      else setOpen(true);
    } catch {
      /* 저장소를 못 쓰면 자동으로 띄우지 않는다 */
    }
  }, [current, standalone]);

  const choose = useCallback(
    (code: Lang) => {
      remember(code);
      setOpen(false);
      const base = standalone ? '/' : stripLang(pathname);
      router.push(localizePath(base, code));
    },
    [pathname, router, standalone],
  );

  if (!open) return null;
  const text = WELCOME_TEXTS[hover] ?? WELCOME_TEXTS.ko;
  const close = () => {
    remember(current);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Choose Your Language">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {!standalone && (
          <button onClick={close} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="border-b border-slate-100 bg-gradient-to-b from-violet-50 to-white p-6 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Globe className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{text.title}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">{text.subtitle}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onMouseEnter={() => setHover(l.code)}
                onFocus={() => setHover(l.code)}
                onClick={() => choose(l.code)}
                className={`group flex flex-col items-center justify-center rounded-2xl border-2 p-3.5 text-center transition-all ${
                  l.code === current ? 'border-brand bg-violet-50/60' : 'border-slate-200 bg-white hover:border-brand hover:bg-violet-50/30'
                }`}
              >
                <span className="mb-2 block h-7 w-10 overflow-hidden rounded-sm shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flagUrl(l.flag)} alt="" className="h-full w-full object-cover" loading="lazy" />
                </span>
                <span className="text-sm font-extrabold leading-tight text-slate-900">{l.name}</span>
                <span className="mt-0.5 w-full truncate text-[11px] font-medium text-slate-500">{l.country}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 p-4">
          <span className="text-xs font-medium text-slate-600">🇰🇷 대한민국 국적이신가요?</span>
          <button onClick={() => choose('ko')} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">
            한국어로 계속 진행하기 ➔
          </button>
        </div>
      </div>
    </div>
  );
}
