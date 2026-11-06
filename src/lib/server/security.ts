// 서버 전용 보안 유틸 (브라우저 번들에 포함되면 안 됩니다: 클라이언트 컴포넌트에서 import 금지)
import crypto from 'crypto';

/** 서명용 비밀값. 전용 환경변수가 없으면 서버 전용 서비스 키로 대체 */
function secretFor(name: string): string {
  const value = process.env[name] || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) {
    throw new Error(`${name} 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.`);
  }
  return value;
}

/** 같은 길이의 해시로 바꿔 비교해서 문자열 길이·내용이 시간차로 새지 않게 한다 */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** 변조 방지 서명 토큰: base64url(payload).서명 */
export function signToken(payload: object, secretName: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secretFor(secretName)).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyToken<T>(token: unknown, secretName: string): T | null {
  if (typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  let expected: string;
  try {
    expected = crypto.createHmac('sha256', secretFor(secretName)).update(body).digest('base64url');
  } catch {
    return null;
  }
  if (!safeEqual(sig, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 요청 횟수 제한 (서버 메모리 방식)
// 한계: 서버리스에서는 인스턴스마다 따로 세므로 완벽하지 않습니다. 운영에서는 DB/Redis 방식으로 교체 권장.
// ---------------------------------------------------------------------------
const buckets = new Map<string, number[]>();

/** true = 허용, false = 제한 초과 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
}
