'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Field, Toggle, ghostBtn, inputCls } from '@/components/admin/ui';
import type { FieldDef } from '@/lib/content/schema';

export type FormValue = Record<string, unknown>;

/** 새 항목의 빈 값 */
export function blankOf(fields: FieldDef[]): FormValue {
  const out: FormValue = {};
  for (const f of fields) {
    switch (f.kind) {
      case 'number':
        out[f.key] = 0;
        break;
      case 'select':
        out[f.key] = f.options[0]?.value ?? '';
        break;
      case 'toggle':
        out[f.key] = true;
        break;
      case 'strings':
      case 'list':
      case 'variants':
        out[f.key] = [];
        break;
      default:
        out[f.key] = '';
    }
  }
  return out;
}

function swap<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const t = i + dir;
  if (t < 0 || t >= list.length) return list;
  const next = [...list];
  [next[i], next[t]] = [next[t], next[i]];
  return next;
}

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const obj = (v: unknown): FormValue => (v && typeof v === 'object' && !Array.isArray(v) ? (v as FormValue) : {});

interface FieldsProps {
  fields: FieldDef[];
  value: FormValue;
  onChange: (value: FormValue) => void;
}

/** 필드 목록 하나를 그린다 (값 전체를 한 덩어리로 받고 돌려준다) */
export default function SchemaForm({ fields, value, onChange }: FieldsProps) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <FieldView key={f.key} def={f} value={value[f.key]} onChange={(v) => set(f.key, v)} />
      ))}
    </div>
  );
}

function RowButtons({ i, count, onMove, onRemove }: { i: number; count: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button type="button" aria-label="위로" disabled={i === 0} onClick={() => onMove(-1)} className={ghostBtn}>
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label="아래로" disabled={i === count - 1} onClick={() => onMove(1)} className={ghostBtn}>
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label="삭제" onClick={onRemove} className={`${ghostBtn} hover:!border-rose-400 hover:!text-rose-600`}>
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function FieldView({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  switch (def.kind) {
    case 'text':
      return (
        <Field label={def.label} hint={def.hint}>
          {def.multiline ? (
            <textarea
              value={String(value ?? '')}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
              maxLength={def.max}
              placeholder={def.placeholder}
              className={inputCls}
            />
          ) : (
            <input
              value={String(value ?? '')}
              onChange={(e) => onChange(e.target.value)}
              maxLength={def.max}
              placeholder={def.placeholder}
              className={inputCls}
            />
          )}
        </Field>
      );

    case 'number':
      return (
        <Field label={def.label} hint={def.hint}>
          <input
            type="number"
            value={Number(value ?? 0)}
            min={def.min}
            max={def.max}
            onChange={(e) => onChange(Number(e.target.value))}
            className={inputCls}
          />
        </Field>
      );

    case 'select':
      return (
        <Field label={def.label} hint={def.hint}>
          <select value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            {def.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      );

    case 'link':
      return (
        <Field label={def.label} hint={def.hint ?? '사이트 안 주소는 /plans 처럼, 바깥 주소는 https://... 로 입력합니다.'}>
          <input
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={def.placeholder ?? '/plans'}
            className={inputCls}
          />
        </Field>
      );

    case 'date':
      return (
        <Field label={def.label} hint={def.hint}>
          <input type="date" value={String(value ?? '').slice(0, 10)} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        </Field>
      );

    case 'toggle':
      return <Toggle checked={value !== false} onChange={onChange} label={def.label} />;

    case 'strings': {
      const items = arr(value).map((v) => String(v ?? ''));
      return (
        <div>
          <p className="text-sm font-bold">{def.label}</p>
          {def.hint && <p className="mt-0.5 text-xs text-slate-400">{def.hint}</p>}
          <div className="mt-1.5 space-y-2">
            {items.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                {def.multiline ? (
                  <textarea
                    value={s}
                    onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))}
                    rows={2}
                    maxLength={def.itemMax}
                    className={`${inputCls} !mt-0 min-w-0 flex-1`}
                  />
                ) : (
                  <input
                    value={s}
                    onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))}
                    maxLength={def.itemMax}
                    className={`${inputCls} !mt-0 min-w-0 flex-1`}
                  />
                )}
                <RowButtons i={i} count={items.length} onMove={(d) => onChange(swap(items, i, d))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
              </div>
            ))}
            {items.length < def.max && (
              <button type="button" onClick={() => onChange([...items, ''])} className={`${ghostBtn} inline-flex items-center gap-1.5`}>
                <Plus className="h-3.5 w-3.5" /> {def.addLabel ?? '추가'}
              </button>
            )}
          </div>
        </div>
      );
    }

    case 'list': {
      const items = arr(value).map(obj);
      return (
        <div>
          <p className="text-sm font-bold">{def.label}</p>
          {def.hint && <p className="mt-0.5 text-xs text-slate-400">{def.hint}</p>}
          <div className="mt-2 space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-2xl bg-soft p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-xs font-extrabold text-slate-500">
                    {i + 1}. {def.itemTitleKey ? String(item[def.itemTitleKey] ?? '') || '(제목 없음)' : '항목'}
                  </p>
                  <RowButtons i={i} count={items.length} onMove={(d) => onChange(swap(items, i, d))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
                </div>
                <SchemaForm fields={def.item} value={item} onChange={(v) => onChange(items.map((x, idx) => (idx === i ? v : x)))} />
              </div>
            ))}
            {items.length < def.max && (
              <button type="button" onClick={() => onChange([...items, blankOf(def.item)])} className={`${ghostBtn} inline-flex items-center gap-1.5`}>
                <Plus className="h-3.5 w-3.5" /> {def.addLabel}
              </button>
            )}
          </div>
        </div>
      );
    }

    case 'variants':
      return <VariantsView def={def} value={value} onChange={onChange} />;
  }
}

function VariantsView({
  def,
  value,
  onChange,
}: {
  def: Extract<FieldDef, { kind: 'variants' }>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const items = arr(value).map(obj);
  const types = Object.keys(def.variants);
  const [nextType, setNextType] = useState(types[0]);

  return (
    <div>
      <p className="text-sm font-bold">{def.label}</p>
      {def.hint && <p className="mt-0.5 text-xs text-slate-400">{def.hint}</p>}
      <div className="mt-2 space-y-3">
        {items.map((item, i) => {
          const variant = def.variants[String(item.type)];
          return (
            <div key={i} className="rounded-2xl border border-black/10 bg-soft p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold text-brand">
                  {i + 1}. {variant?.label ?? '알 수 없는 블록'}
                </p>
                <RowButtons i={i} count={items.length} onMove={(d) => onChange(swap(items, i, d))} onRemove={() => onChange(items.filter((_, idx) => idx !== i))} />
              </div>
              {variant && (
                <SchemaForm
                  fields={variant.fields}
                  value={item}
                  onChange={(v) => onChange(items.map((x, idx) => (idx === i ? { ...v, type: item.type } : x)))}
                />
              )}
            </div>
          );
        })}
        {items.length < def.max && (
          <div className="flex flex-wrap items-center gap-2">
            <select value={nextType} onChange={(e) => setNextType(e.target.value)} className={`${inputCls} !mt-0 w-auto`} aria-label="추가할 종류">
              {types.map((t) => (
                <option key={t} value={t}>
                  {def.variants[t].label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onChange([...items, { ...blankOf(def.variants[nextType].fields), type: nextType }])}
              className={`${ghostBtn} inline-flex items-center gap-1.5`}
            >
              <Plus className="h-3.5 w-3.5" /> {def.addLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
