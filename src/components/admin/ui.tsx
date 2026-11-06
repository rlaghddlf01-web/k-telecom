'use client';

import { X } from 'lucide-react';

export const inputCls =
  'mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm font-bold"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  );
}

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="my-6 w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="text-base font-black">{title}</h2>
          <button onClick={onClose} aria-label="닫기" className="rounded-full p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-black/5 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Notice({ tone = 'amber', children }: { tone?: 'amber' | 'sky'; children: React.ReactNode }) {
  const cls = tone === 'sky' ? 'bg-sky-50 text-sky-900 ring-sky-200' : 'bg-amber-50 text-amber-900 ring-amber-200';
  return <div className={`mb-5 rounded-2xl p-4 text-sm ring-1 ${cls}`}>{children}</div>;
}

export const primaryBtn =
  'rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60';
export const ghostBtn =
  'rounded-full border border-black/10 px-4 py-2 text-xs font-bold transition-colors hover:border-brand hover:text-brand disabled:opacity-40';
