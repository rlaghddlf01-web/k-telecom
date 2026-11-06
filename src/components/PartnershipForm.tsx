'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PARTNER_TYPES } from '@/lib/site';
import { inputClass } from '@/components/formStyles';
import { useT } from '@/components/LangProvider';

type Status = 'idle' | 'sending' | 'done' | 'error';


export default function PartnershipForm() {
  const t = useT();
  const [status, setStatus] = useState<Status>('idle');
  const [types, setTypes] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleType = (name: string) =>
    setTypes((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (types.length === 0) {
      setError(t('제휴 유형을 하나 이상 선택해 주세요.'));
      return;
    }
    setError('');
    setStatus('sending');

    try {
      const res = await fetch('/api/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.get('company'),
          name: form.get('name'),
          position: form.get('position'),
          phone: form.get('phone'),
          email: form.get('email'),
          types,
          message: form.get('message'),
          agree: form.get('agree') === 'on',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'request failed');
      }
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error && err.message !== 'request failed' ? err.message : t('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'));
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-3xl bg-soft p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h2 className="mt-4 text-xl font-black">{t('제휴 신청이 접수되었습니다')}</h2>
        <p className="mt-2 text-sm text-slate-500">{t('담당자가 확인 후 영업일 기준 2일 이내 연락드리겠습니다.')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl bg-soft p-6 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-bold">
          {t('회사명')} <span className="text-brand">*</span>
          <input name="company" required maxLength={100} className={inputClass} />
        </label>
        <label className="block text-sm font-bold">
          {t('담당자 이름')} <span className="text-brand">*</span>
          <input name="name" required maxLength={50} className={inputClass} />
        </label>
        <label className="block text-sm font-bold">
          {t('직책 / 부서')}
          <input name="position" maxLength={50} className={inputClass} />
        </label>
        <label className="block text-sm font-bold">
          {t('연락처')} <span className="text-brand">*</span>
          <input name="phone" type="tel" required maxLength={30} placeholder="010-0000-0000" className={inputClass} />
        </label>
      </div>

      <label className="block text-sm font-bold">
        {t('이메일')} <span className="text-brand">*</span>
        <input name="email" type="email" required maxLength={100} className={inputClass} />
      </label>

      <fieldset>
        <legend className="text-sm font-bold">
          {t('제휴 유형')} <span className="text-brand">*</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PARTNER_TYPES.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => toggleType(name)}
              aria-pressed={types.includes(name)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                types.includes(name)
                  ? 'border-brand bg-brand text-white'
                  : 'border-black/10 bg-white text-slate-600 hover:border-brand'
              }`}
            >
              {t(name)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-bold">
        {t('제안 내용')}
        <textarea name="message" rows={5} maxLength={2000} className={inputClass} />
      </label>

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input name="agree" type="checkbox" required className="mt-0.5" />
        <span>{t('제휴 상담을 위한 개인정보(이름, 연락처, 이메일) 수집·이용에 동의합니다.')}</span>
      </label>

      {error && <p className="text-sm font-semibold text-brand">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'sending' ? t('전송 중...') : t('제휴 신청하기')}
      </button>
    </form>
  );
}
