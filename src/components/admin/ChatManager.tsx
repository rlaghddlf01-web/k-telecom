'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminFetch, errorMessage, jsonInit } from '@/components/admin/adminApi';
import ImageField from '@/components/admin/ImageField';
import { Field, Notice, Toggle, inputCls, primaryBtn } from '@/components/admin/ui';
import type { ChatSettings } from '@/lib/content/chat';

type Mode = 'supabase' | 'memory' | 'none';

/** 상담 창: 매니저 소개, AI 채팅 사용 여부, 츠츠앱·텔레그램·페이스북 메신저·카카오톡 연결 */
export default function ChatManager({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [value, setValue] = useState<ChatSettings | null>(null);
  const [mode, setMode] = useState<Mode>('supabase');
  const [aiKey, setAiKey] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const res = await adminFetch<{ value?: ChatSettings; mode?: Mode; aiKeyConfigured?: boolean }>('/api/admin/chat');
    if (res.status === 401) return onUnauthorized();
    if (!res.ok || !res.data.value) return setMessage(errorMessage(res, '설정을 불러오지 못했습니다.'));
    setValue(res.data.value);
    setMode(res.data.mode ?? 'none');
    setAiKey(!!res.data.aiKeyConfigured);
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!value) return;
    setSaving(true);
    setMessage('');
    const res = await adminFetch('/api/admin/chat', jsonInit('PUT', { value }));
    setSaving(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok) return setMessage(errorMessage(res));
    setMessage('저장했습니다. 사이트에 바로 반영됩니다.');
    await load();
  }

  if (!value) return <p className="py-10 text-center text-sm text-slate-400">{message || '불러오는 중...'}</p>;
  const set = <K extends keyof ChatSettings>(key: K, v: ChatSettings[K]) => setValue({ ...value, [key]: v });

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">상담 창</h1>
        <button className={primaryBtn} onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        사이트 오른쪽 아래 상담 버튼을 눌렀을 때 나오는 창입니다. 워워 둔 메신저는 버튼이 나오지 않고, 입력한 메신저만 보입니다. 고객 화면의 안내 문구는 언어별로 자동 번역됩니다.
      </p>

      {mode === 'none' && <Notice>저장소(Supabase)가 연결되지 않아 저장할 수 없습니다. docs/telecom_cms.sql 실행과 환경변수 등록이 필요합니다.</Notice>}
      {mode === 'memory' && <Notice tone="sky">개발 모드: 저장소 없이 메모리에만 임시 저장됩니다. 개발 서버를 껐다 켜면 사라집니다.</Notice>}
      {!aiKey && (
        <Notice>
          AI 매니저 채팅에 쓰는 키(GOOGLE_API_KEY)가 이 서버에 등록되어 있지 않습니다. Vercel 환경변수에 등록하기 전까지는 AI 대신 아래 메신저 안내가 나옵니다.
        </Notice>
      )}
      {message && (
        <p className="mb-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm" role="status">
          {message}
        </p>
      )}

      <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
        <section className="space-y-4">
          <h2 className="text-sm font-black">매니저 소개</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="매니저 이름">
              <input className={inputCls} value={value.managerName} maxLength={40} onChange={(e) => set('managerName', e.target.value)} />
            </Field>
            <Field label="직함">
              <input className={inputCls} value={value.managerRole} maxLength={30} onChange={(e) => set('managerRole', e.target.value)} />
            </Field>
          </div>
          <Field label="한 줄 소개">
            <input className={inputCls} value={value.intro} maxLength={120} onChange={(e) => set('intro', e.target.value)} />
          </Field>
          <Field label="닫혀 있을 때 말풍선" hint="상담 창을 열기 전, 상담 버튼 위에 뜨는 인사 문구입니다.">
            <textarea className={inputCls} rows={2} value={value.teaser} maxLength={200} onChange={(e) => set('teaser', e.target.value)} />
          </Field>
          <Field label="매니저 사진 (선택)" hint="워우면 기본 아이콘이 보입니다.">
            <ImageField value={value.avatar} onChange={(url) => set('avatar', url)} folder="banners" onUnauthorized={onUnauthorized} />
          </Field>
          <Toggle checked={value.aiEnabled} onChange={(v) => set('aiEnabled', v)} label="AI 매니저 실시간 채팅 사용 (고객 언어로 자동 답변)" />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-black">메신저 연결</h2>
          <Field label="츠츠앱 번호" hint="국가번호를 포함한 숫자만. 예: 821012345678 (+, -, 0 제외)">
            <input className={inputCls} value={value.whatsapp} maxLength={30} inputMode="numeric" onChange={(e) => set('whatsapp', e.target.value)} />
          </Field>
          <Field label="텔레그램 아이디" hint="@ 없이 입력. 예: ktelecom_support (봇 이름도 가능)">
            <input className={inputCls} value={value.telegram} maxLength={40} onChange={(e) => set('telegram', e.target.value)} />
          </Field>
          <Field label="페이스북 메신저 (페이지 아이디)" hint="페이스북 페이지 주소 끝의 아이디. 예: ktelecom.official">
            <input className={inputCls} value={value.messenger} maxLength={60} onChange={(e) => set('messenger', e.target.value)} />
          </Field>
          <Field label="카카오톡 오픈채팅 주소 (선택)" hint="https://open.kakao.com/ 으로 시작하는 주소">
            <input className={inputCls} value={value.kakao} maxLength={200} onChange={(e) => set('kakao', e.target.value)} />
          </Field>
        </section>
      </div>
    </div>
  );
}
