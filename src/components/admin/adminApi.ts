// 관리자 화면에서 서버 API 를 부르는 공통 함수 (브라우저용)

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T;
}

export async function adminFetch<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, init);
    const data = (await res.json().catch(() => ({}))) as T;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: {} as T };
  }
}

export const jsonInit = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: body === undefined ? undefined : JSON.stringify(body),
});

/** API 오류 응답에서 사용자에게 보여줄 문구를 꺼낸다 */
export function errorMessage(result: ApiResult<unknown>, fallback = '처리에 실패했습니다.'): string {
  const data = result.data as { error?: unknown };
  if (typeof data?.error === 'string' && data.error) return data.error;
  if (result.status === 0) return '서버에 연결하지 못했습니다.';
  return fallback;
}
