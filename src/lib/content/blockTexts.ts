import type { Block } from '@/lib/pages';

/** 페이지 블록 안의 모든 한국어 문구를 모은다 (번역 저장소에서 미리 번역해 두기 위해) */
export function blockTexts(blocks: Block[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === 'notice') out.push(b.text);
    else if (b.type === 'text') out.push(...(b.heading ? [b.heading] : []), ...b.paragraphs);
    else if (b.type === 'cards') b.items.forEach((i) => out.push(i.title, i.desc));
    else if (b.type === 'steps') out.push(...(b.heading ? [b.heading] : []), ...b.items.flatMap((i) => [i.title, i.desc]));
    else if (b.type === 'table') out.push(...(b.heading ? [b.heading] : []), ...(b.head ?? []), ...b.rows.flat().filter((c) => !c.startsWith('@@')));
    else if (b.type === 'faq') b.items.forEach((i) => out.push(i.q, i.a));
    else if (b.type === 'links') out.push(...(b.heading ? [b.heading] : []), ...b.items.map((i) => i.label));
    else if (b.type === 'cta') out.push(b.title, b.desc, b.label);
  }
  return out;
}
