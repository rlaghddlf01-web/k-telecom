/** 조건부 클래스 이름 이어 붙이기 (거짓 값은 뺀다) */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
