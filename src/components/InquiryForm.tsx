'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { inputClass } from '@/components/formStyles';
import { t } from '@/lib/i18n';

export const INQUIRY_CATEGORIES = ['요금제', '스마트폰', '인터넷·IPTV', '이벤트', '기타'];

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: form.get('email'),
          category: form.get('category'),
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
      setError(
        err instanceof Error && err.message !== 'request failed'
          ? err.message
          : t('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      );
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-3xl bg-soft p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h2 className="mt-4 text-xl font-black">{t('상담 요청이 접수되었습니다')}</h2>
        <p className="mt-2 text-sm text-slate-500">{t('남겨주신 연락처로 담당자가 연락드리겠습니다.')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl bg-soft p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-bold">
          {t('이름')} <span className="text-brand">*</span>
          <input name="name" required maxLength={50} className={inputClass} />
        </label>
        <label className="block text-sm font-bold">
          {t('연락처')} <span className="text-brand">*</span>
          <input name="phone" type="tel" required maxLength={30} placeholder="010-0000-0000" className={inputClass} />
        </label>
        <label className="block text-sm font-bold">
          {t('이메일')}
          <input name="email" type="email" maxLength={100} className={inputClass} />
        </label>
        <label className="block text-sm font-bold">
          {t('문의 유형')} <span className="text-brand">*</span>
          <select name="category" required defaultValue="" className={inputClass}>
            <option value="" disabled>{t('선택해 주세요')}</option>
            {INQUIRY_CATEGORIES.map((c) => (
              <option key={c} value={c}>{t(c)}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-bold">
        {t('문의 내용')} <span className="text-brand">*</span>
        <textarea name="message" required rows={6} maxLength={2000} className={inputClass} />
      </label>

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input name="agree" type="checkbox" required className="mt-0.5" />
        <span>{t('상담을 위한 개인정보(이름, 연락처, 이메일) 수집·이용에 동의합니다.')}</span>
      </label>

      {error && <p className="text-sm font-semibold text-brand">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'sending' ? t('전송 중...') : t('상담 요청하기')}
      </button>
    </form>
  );
}
