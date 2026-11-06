// 가입접수 / 상담문의 / 제휴신청 저장 (서버 전용)
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/server/supabaseAdmin';

export type SubmissionKind = 'application' | 'inquiry' | 'partnership';

export const TABLES: Record<SubmissionKind, string> = {
  application: 'telecom_applications',
  inquiry: 'telecom_inquiries',
  partnership: 'telecom_partnerships',
};

/** 관리자 화면 검색에 쓰는 컬럼 */
export const SEARCH_COLUMNS: Record<SubmissionKind, string[]> = {
  application: ['name', 'phone', 'email', 'plan_name'],
  inquiry: ['name', 'phone', 'email', 'message'],
  partnership: ['company', 'name', 'phone', 'email'],
};

export const STATUSES = ['new', 'contacted', 'done', 'cancelled'] as const;
export type SubmissionStatus = (typeof STATUSES)[number];

export function isKind(value: unknown): value is SubmissionKind {
  return value === 'application' || value === 'inquiry' || value === 'partnership';
}

export function isStatus(value: unknown): value is SubmissionStatus {
  return typeof value === 'string' && (STATUSES as readonly string[]).includes(value);
}

/**
 * 접수 내용을 DB에 저장한다.
 * - 저장소 환경변수가 없으면 저장하지 않고 { stored: false } (시험 단계)
 * - 저장에 실패하면 { stored: false, failed: true }
 * 개인정보는 로그에 남기지 않는다 (오류 코드만).
 */
export async function saveSubmission(
  kind: SubmissionKind,
  row: Record<string, unknown>,
): Promise<{ stored: boolean; failed?: boolean }> {
  if (!isSupabaseConfigured()) return { stored: false };
  try {
    const { error } = await getSupabaseAdmin().from(TABLES[kind]).insert(row);
    if (error) {
      console.error(`[${kind}] save failed:`, error.code);
      return { stored: false, failed: true };
    }
    return { stored: true };
  } catch (err) {
    console.error(`[${kind}] save error:`, err instanceof Error ? err.name : 'unknown');
    return { stored: false, failed: true };
  }
}
