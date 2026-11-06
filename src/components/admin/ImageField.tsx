'use client';

import { useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { adminFetch, errorMessage } from '@/components/admin/adminApi';
import { ghostBtn, inputCls } from '@/components/admin/ui';

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder: 'banners' | 'products';
  onUnauthorized: () => void;
}

/** 이미지 올리기: 파일을 서버로 올려 주소를 받아 저장한다. 직접 https:// 주소를 넣을 수도 있다. */
export default function ImageField({ value, onChange, folder, onUnauthorized }: ImageFieldProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setBusy(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await adminFetch<{ url?: string }>('/api/admin/upload', { method: 'POST', body: form });
    setBusy(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.ok || !res.data.url) return setError(errorMessage(res, '이미지를 올리지 못했습니다.'));
    onChange(res.data.url);
  }

  return (
    <div className="mt-1.5">
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xs text-slate-400 ring-1 ring-black/10">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            '이미지 없음'
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <label className={`${ghostBtn} inline-flex cursor-pointer items-center gap-1.5`}>
              <ImagePlus className="h-3.5 w-3.5" />
              {busy ? '올리는 중...' : '이미지 올리기'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) upload(file);
                }}
              />
            </label>
            {value && (
              <button type="button" onClick={() => onChange('')} className={`${ghostBtn} inline-flex items-center gap-1.5`}>
                <Trash2 className="h-3.5 w-3.5" /> 이미지 삭제
              </button>
            )}
          </div>
          <input
            type="text"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="또는 이미지 주소 입력 (https://...)"
            className={`${inputCls} !mt-0 !py-2 text-xs`}
          />
        </div>
      </div>
      <p className="mt-1.5 text-xs font-normal text-slate-400">PNG·JPG·WEBP·GIF, 3.5MB 이하. 올리지 않으면 색 배경과 폰 그림이 대신 보입니다.</p>
      {error && <p className="mt-1 text-xs font-semibold text-brand">{error}</p>}
    </div>
  );
}
