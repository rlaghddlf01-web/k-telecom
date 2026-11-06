// 페이지 내용 블록: 화면에 그리는 모양(Block)과 DB·관리자 입력 모양(Stored) 사이 변환.
// 다른 점은 표의 줄뿐이다 (Block: string[][]  /  Stored: { cells: string[] }[]).
import type { Block } from '@/lib/pages';

export type StoredBlock = Record<string, unknown> & { type: string };

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** 화면용 블록 → 저장·편집용 블록 (입력칸이 항상 있도록 빈 값을 채운다) */
export function encodeBlocks(blocks: Block[]): StoredBlock[] {
  return blocks.map((b): StoredBlock => {
    switch (b.type) {
      case 'text':
        return { type: 'text', heading: b.heading ?? '', paragraphs: [...b.paragraphs] };
      case 'steps':
        return { type: 'steps', heading: b.heading ?? '', items: b.items.map((i) => ({ ...i })) };
      case 'table':
        return { type: 'table', heading: b.heading ?? '', head: [...(b.head ?? [])], rows: b.rows.map((cells) => ({ cells: [...cells] })) };
      case 'links':
        return { type: 'links', heading: b.heading ?? '', items: b.items.map((i) => ({ ...i })) };
      case 'cards':
        return { type: 'cards', items: b.items.map((i) => ({ ...i })) };
      case 'faq':
        return { type: 'faq', items: b.items.map((i) => ({ ...i })) };
      case 'notice':
        return { type: 'notice', text: b.text };
      case 'cta':
        return { type: 'cta', title: b.title, desc: b.desc, label: b.label, href: b.href };
    }
  });
}

/** 저장된 블록 → 화면용 블록 (알 수 없는 모양은 건너뛴다) */
export function decodeBlocks(stored: unknown): Block[] {
  const out: Block[] = [];
  for (const raw of arr(stored)) {
    const b = (raw ?? {}) as Record<string, unknown>;
    const heading = str(b.heading) || undefined;
    switch (b.type) {
      case 'text':
        out.push({ type: 'text', heading, paragraphs: arr(b.paragraphs).map(str).filter(Boolean) });
        break;
      case 'steps':
        out.push({ type: 'steps', heading, items: arr(b.items).map((i) => ({ title: str((i as Record<string, unknown>)?.title), desc: str((i as Record<string, unknown>)?.desc) })) });
        break;
      case 'table': {
        const head = arr(b.head).map(str);
        out.push({
          type: 'table',
          heading,
          head: head.some(Boolean) ? head : undefined,
          rows: arr(b.rows).map((r) => arr((r as Record<string, unknown>)?.cells).map(str)),
        });
        break;
      }
      case 'links':
        out.push({ type: 'links', heading, items: arr(b.items).map((i) => ({ label: str((i as Record<string, unknown>)?.label), href: str((i as Record<string, unknown>)?.href) })) });
        break;
      case 'cards':
        out.push({
          type: 'cards',
          items: arr(b.items).map((i) => {
            const it = (i ?? {}) as Record<string, unknown>;
            return { icon: (str(it.icon) || 'badge') as never, title: str(it.title), desc: str(it.desc) };
          }),
        });
        break;
      case 'faq':
        out.push({ type: 'faq', items: arr(b.items).map((i) => ({ q: str((i as Record<string, unknown>)?.q), a: str((i as Record<string, unknown>)?.a) })) });
        break;
      case 'notice':
        out.push({ type: 'notice', text: str(b.text) });
        break;
      case 'cta':
        out.push({ type: 'cta', title: str(b.title), desc: str(b.desc), label: str(b.label), href: str(b.href) });
        break;
    }
  }
  return out;
}
