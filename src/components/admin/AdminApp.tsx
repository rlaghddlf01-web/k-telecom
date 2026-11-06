'use client';

import { useCallback, useEffect, useState } from 'react';
import { LogOut, Search, X, Inbox, Info, RefreshCw } from 'lucide-react';

type Kind = 'application' | 'inquiry' | 'partnership';
type Row = { id: string; status: string; memo: string; created_at: string } & Record<string, unknown>;
type Counts = Record<string, Record<string, number>>;

const STATUS_LABELS: Record<string, string> = { new: '신규', contacted: '상담중', done: '완료', cancelled: '취소' };
const STATUS_TONE: Record<string, string> = {
  new: 'bg-rose-100 text-rose-700',
  contacted: 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-200 text-slate-600',
};

const VALUE_LABELS: Record<string, Record<string, string>> = {
  join_type: { new: '신규가입', port: '번호이동' },
  billing: { post: '후불', pre: '선불' },
  sim: { usim: 'USIM', esim: 'eSIM' },
  sim_buy: { buy: '유심구매', own: '유심보유' },
};

interface KindConfig {
  label: string;
  /** 목록 표에 보여줄 컬럼 */
  columns: [string, string][];
  /** 상세 화면에 보여줄 항목 */
  detail: [string, string][];
}

const KINDS: Record<Kind, KindConfig> = {
  application: {
    label: '가입접수',
    columns: [['name', '이름'], ['phone', '연락처'], ['plan_name', '요금제'], ['network', '통신망']],
    detail: [
      ['name', '이름'], ['nationality', '국적'], ['phone', '연락처'], ['email', '이메일'],
      ['join_type', '가입유형'], ['network', '통신망'], ['billing', '상품유형'], ['plan_name', '요금제'],
      ['sim', 'SIM 유형'], ['sim_buy', '유심'], ['wish_number', '희망번호 끝 4자리'], ['current_number', '현재 번호(번호이동)'],
    ],
  },
  inquiry: {
    label: '상담문의',
    columns: [['name', '이름'], ['phone', '연락처'], ['category', '문의 유형']],
    detail: [['name', '이름'], ['phone', '연락처'], ['email', '이메일'], ['category', '문의 유형'], ['message', '문의 내용']],
  },
  partnership: {
    label: '제휴신청',
    columns: [['company', '회사명'], ['name', '담당자'], ['phone', '연락처']],
    detail: [
      ['company', '회사명'], ['name', '담당자'], ['position', '직책/부서'], ['phone', '연락처'],
      ['email', '이메일'], ['types', '제휴 유형'], ['message', '제안 내용'],
    ],
  },
};

const KIND_ORDER: Kind[] = ['application', 'inquiry', 'partnership'];

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.join(', ');
  const mapped = VALUE_LABELS[key]?.[String(value)];
  return mapped ?? String(value);
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

export default function AdminApp() {
  const [auth, setAuth] = useState<'loading' | 'out' | 'in'>('loading');
  const [configured, setConfigured] = useState(true);
  const [devBypass, setDevBypass] = useState(false);

  useEffect(() => {
    fetch('/api/admin/login')
      .then((r) => r.json())
      .then((d) => {
        setConfigured(!!d.configured);
        setDevBypass(!!d.devBypass);
        setAuth(d.authenticated ? 'in' : 'out');
      })
      .catch(() => setAuth('out'));
  }, []);

  if (auth === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">불러오는 중...</div>;
  }
  if (auth === 'out') {
    return <LoginForm configured={configured} onSuccess={() => setAuth('in')} />;
  }
  return <Dashboard devBypass={devBypass} onLogout={() => setAuth('out')} />;
}

// ---------------------------------------------------------------------------
function LoginForm({ configured, onSuccess }: { configured: boolean; onSuccess: () => void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) return onSuccess();
      setError(data.message || '로그인에 실패했습니다.');
    } catch {
      setError('서버에 연결하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  }

  const input = 'mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <p className="text-2xl font-black text-brand">K-Telecom</p>
          <p className="mt-1 text-sm font-bold text-slate-500">관리자 로그인</p>
        </div>
        {!configured && (
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            관리자 계정이 아직 설정되지 않았습니다. Vercel 환경변수 ADMIN_ID, ADMIN_PASSWORD를 등록한 뒤 다시 배포해 주세요.
          </p>
        )}
        <label className="block text-sm font-bold">
          아이디
          <input value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required className={input} />
        </label>
        <label className="block text-sm font-bold">
          비밀번호
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className={input} />
        </label>
        {error && <p className="text-sm font-semibold text-brand">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? '확인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
function Dashboard({ devBypass, onLogout }: { devBypass: boolean; onLogout: () => void }) {
  const [tab, setTab] = useState<'summary' | Kind>('summary');
  const [counts, setCounts] = useState<Counts>({});
  const [configured, setConfigured] = useState(true);
  const [sample, setSample] = useState(false);

  const handleUnauthorized = useCallback(() => onLogout(), [onLogout]);

  const loadCounts = useCallback(() => {
    fetch('/api/admin/submissions?summary=1')
      .then((r) => {
        if (r.status === 401) {
          handleUnauthorized();
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setConfigured(d.configured !== false);
        setSample(!!d.sample);
        setCounts(d.counts ?? {});
      })
      .catch(() => undefined);
  }, [handleUnauthorized]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' }).catch(() => undefined);
    onLogout();
  }

  const newCount = (kind: Kind) => counts[kind]?.new ?? 0;

  return (
    <div className="min-h-screen bg-soft">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <p className="text-lg font-black text-brand">
            K-Telecom <span className="text-sm font-bold text-slate-400">관리자</span>
          </p>
          {!devBypass && (
            <button onClick={logout} className="flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-bold hover:border-brand hover:text-brand">
              <LogOut className="h-3.5 w-3.5" /> 로그아웃
            </button>
          )}
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {([['summary', '대시보드'] as const, ...KIND_ORDER.map((k) => [k, KINDS[k].label] as const)]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === id ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-ink'
              }`}
            >
              {label}
              {id !== 'summary' && newCount(id) > 0 && (
                <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-extrabold text-white">{newCount(id)}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {devBypass && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900 ring-1 ring-sky-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <b>개발 모드</b> — 로그인 없이 접속 중입니다. 이 우회는 내 컴퓨터에서 개발 서버(npm run dev)로 실행할 때만 켜지고, 배포된 사이트에서는 켜지지 않습니다.
              {sample && ' 저장소가 연결되지 않아 화면 확인용 샘플 데이터를 보여 주며, 여기서 바꾼 상태·메모는 저장되지 않습니다.'}
            </p>
          </div>
        )}
        {!configured && !sample && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              저장소(Supabase)가 아직 연결되지 않아 접수 내용이 저장되지 않고 있습니다. <b>docs/telecom_admin.sql</b>을 Supabase에서 실행하고,
              Vercel 환경변수 <b>NEXT_PUBLIC_SUPABASE_URL</b>, <b>SUPABASE_SERVICE_ROLE_KEY</b>를 등록한 뒤 다시 배포하면 이 화면에 접수 내용이 나타납니다.
            </p>
          </div>
        )}

        {tab === 'summary' ? (
          <Summary counts={counts} onRefresh={loadCounts} onOpen={setTab} />
        ) : (
          <List key={tab} kind={tab} onChanged={loadCounts} onUnauthorized={handleUnauthorized} />
        )}
      </main>
    </div>
  );
}

function Summary({ counts, onRefresh, onOpen }: { counts: Counts; onRefresh: () => void; onOpen: (k: Kind) => void }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-black">접수 현황</h1>
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand">
          <RefreshCw className="h-3.5 w-3.5" /> 새로고침
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {KIND_ORDER.map((kind) => {
          const c = counts[kind] ?? {};
          const total = Object.values(c).reduce((a, b) => a + b, 0);
          return (
            <button key={kind} onClick={() => onOpen(kind)} className="rounded-2xl bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-lg">
              <p className="text-sm font-bold text-slate-500">{KINDS[kind].label}</p>
              <p className="mt-2 text-3xl font-black">
                {c.new ?? 0}
                <span className="ml-1 text-sm font-bold text-rose-600">신규</span>
              </p>
              <p className="mt-3 text-xs text-slate-400">
                전체 {total} · 상담중 {c.contacted ?? 0} · 완료 {c.done ?? 0} · 취소 {c.cancelled ?? 0}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function List({ kind, onChanged, onUnauthorized }: { kind: Kind; onChanged: () => void; onUnauthorized: () => void }) {
  const config = KINDS[kind];
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [appliedQ, setAppliedQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Row | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ kind });
      if (status) params.set('status', status);
      if (appliedQ) params.set('q', appliedQ);
      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      if (res.status === 401) return onUnauthorized();
      const data = await res.json();
      if (!res.ok) throw new Error();
      setRows(data.rows ?? []);
    } catch {
      setError('목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [kind, status, appliedQ, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-lg font-black">{config.label}</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="상태"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold outline-none focus:border-brand"
        >
          <option value="">전체 상태</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAppliedQ(q.trim());
          }}
          className="relative"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름·연락처 검색"
            className="w-56 rounded-full border border-black/10 bg-white py-2 pl-4 pr-10 text-sm outline-none focus:border-brand"
          />
          <button type="submit" aria-label="검색" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {error && <p className="mb-3 text-sm font-semibold text-brand">{error}</p>}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500">
            <tr>
              <th className="px-4 py-3">접수일</th>
              <th className="px-4 py-3">상태</th>
              {config.columns.map(([, label]) => (
                <th key={label} className="px-4 py-3">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((row) => (
              <tr key={row.id} onClick={() => setSelected(row)} className="cursor-pointer transition-colors hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(row.created_at)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${STATUS_TONE[row.status] ?? ''}`}>
                    {STATUS_LABELS[row.status] ?? row.status}
                  </span>
                </td>
                {config.columns.map(([key]) => (
                  <td key={key} className="px-4 py-3">{formatValue(key, row[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-sm text-slate-400">
            <Inbox className="h-8 w-8" />
            {appliedQ || status ? '조건에 맞는 접수가 없습니다.' : '접수된 내용이 없습니다.'}
          </div>
        )}
        {loading && <p className="py-16 text-center text-sm text-slate-400">불러오는 중...</p>}
      </div>
      <p className="mt-3 text-xs text-slate-400">최근 200건까지 표시합니다.</p>

      {selected && (
        <DetailPanel
          kind={kind}
          row={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) => {
            setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelected(updated);
            onChanged();
          }}
          onUnauthorized={onUnauthorized}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function DetailPanel({
  kind, row, onClose, onSaved, onUnauthorized,
}: {
  kind: Kind;
  row: Row;
  onClose: () => void;
  onSaved: (row: Row) => void;
  onUnauthorized: () => void;
}) {
  const config = KINDS[kind];
  const [status, setStatus] = useState(row.status);
  const [memo, setMemo] = useState(row.memo ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id: row.id, status, memo }),
      });
      if (res.status === 401) return onUnauthorized();
      if (!res.ok) throw new Error();
      onSaved({ ...row, status, memo });
      setMessage('저장되었습니다.');
    } catch {
      setMessage('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  const phone = typeof row.phone === 'string' ? row.phone : '';

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/40" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">{config.label}</p>
            <p className="text-sm text-slate-500">{new Date(row.created_at).toLocaleString('ko-KR')}</p>
          </div>
          <button onClick={onClose} aria-label="닫기" className="rounded-full p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-5 divide-y divide-black/5 rounded-2xl text-sm ring-1 ring-black/10">
          {config.detail.map(([key, label]) => (
            <div key={key} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3">
              <dt className="font-bold text-slate-500">{label}</dt>
              <dd className="whitespace-pre-wrap break-words">
                {key === 'phone' && phone ? (
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="font-bold text-brand hover:underline">{phone}</a>
                ) : (
                  formatValue(key, row[key])
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-bold">
            처리 상태
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand"
            >
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold">
            메모
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={5}
              maxLength={1000}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </label>
          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          {message && <p className="text-center text-sm font-semibold text-slate-600">{message}</p>}
        </div>
      </aside>
    </div>
  );
}
