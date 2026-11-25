import {
  getContentPage,
  getCustomPagePaths,
  getEvents,
  getFaqsForLang,
  getNotices,
  getPageMeta,
  getPlans,
  getProducts,
  getSiteSettings,
} from '@/lib/content/load';
import { DEDICATED_PAGES } from '@/lib/content/pageIndex';
import { dictionaryOf } from '@/lib/dictionaries';
import { PAGES, type Block } from '@/lib/pages';
import { PHONE_EXTRAS, PHONE_INCLUDES, PHONE_POLICY } from '@/lib/phoneExtras';
import type { Plan } from '@/lib/plans';
import { PHONES_COMING_SOON, PHONES_SOON_AI_NOTE } from '@/lib/phoneStatus';

/**
 * AI 상담사가 쓰는 도구. 요금제·휴대폰·FAQ 전체를 프롬프트에 넣지 않고,
 * 고객이 물으면 AI 가 이 도구로 필요한 것만 찾아서 답한다. 결과는 한국어 원문이다.
 */

type Args = Record<string, unknown>;

export const TOOL_DECLARATIONS = [
  {
    name: 'search_plans',
    description:
      'Search the registered mobile plans (hundreds of them). Use it whenever the customer asks about plans, prices, data, carriers, or a budget. Returns at most 8 plans with id, name, carrier, billing, data, voice, SMS, list price, current monthly price, discount note and perks.',
    parameters: {
      type: 'OBJECT',
      properties: {
        network: { type: 'STRING', description: 'Carrier network: SKT, KT or LGU+' },
        billing: { type: 'STRING', description: 'post (postpaid) or prepaid' },
        min_price: { type: 'INTEGER', description: 'Minimum current monthly price in KRW' },
        max_price: { type: 'INTEGER', description: 'Maximum current monthly price in KRW' },
        min_data_gb: { type: 'NUMBER', description: 'Minimum monthly data in GB (use 999 for unlimited)' },
        keyword: { type: 'STRING', description: 'Korean word to match in name or perks, e.g. 결합, eSIM, 인터넷, 무제한, 평생' },
        sort: { type: 'STRING', description: 'price_asc (default), data_desc, or lifetime_discount_first' },
      },
    },
  },
  {
    name: 'get_plan',
    description: 'Get the full detail of one plan by its name (or part of it) or id.',
    parameters: { type: 'OBJECT', properties: { name: { type: 'STRING', description: 'Plan name or id' } }, required: ['name'] },
  },
  {
    name: 'search_phones',
    description: 'List the phones for sale with their monthly price (24-month installment). Optionally filter by brand (samsung or apple) or a keyword in the name.',
    parameters: {
      type: 'OBJECT',
      properties: {
        brand: { type: 'STRING', description: 'samsung or apple' },
        keyword: { type: 'STRING', description: 'Part of the phone name, e.g. S26, 폴드, 아이폰' },
        max_monthly: { type: 'INTEGER', description: 'Maximum monthly price in KRW' },
      },
    },
  },
  {
    name: 'get_phone',
    description: 'Get the full detail of one phone: price, specifications, what is in the box, and the exchange/return policy.',
    parameters: { type: 'OBJECT', properties: { name: { type: 'STRING', description: 'Phone name or part of it' } }, required: ['name'] },
  },
  {
    name: 'list_pages',
    description: 'List every information page of the website (title, path and one-line summary): self-activation, add-on services, phone installments, internet, IPTV, forms, guides, order status, company, location, terms, privacy, custom pages.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'search_pages',
    description: 'Search the text of all website information pages by keyword (e.g. 셀프개통, 부가서비스, 할부, 인터넷, IPTV, 약관, 개인정보, 주문조회, 서류) and return the matching pages with their content.',
    parameters: { type: 'OBJECT', properties: { keyword: { type: 'STRING', description: 'Korean keyword' } }, required: ['keyword'] },
  },
  {
    name: 'get_page',
    description: 'Get the full content of one website page by its path (e.g. /plans/self, /internet, /company) or title.',
    parameters: { type: 'OBJECT', properties: { page: { type: 'STRING', description: 'Page path or title' } }, required: ['page'] },
  },
  {
    name: 'get_events',
    description: 'Current events and promotions (title, period, details).',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'get_notices',
    description: 'Recent notices (title, date, details).',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'get_company_info',
    description: 'Company information: name, CEO, address, phone, email, business registration numbers, and how to reach staff.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'search_faq',
    description: 'Search the frequently asked questions (sign-up documents, activation, number porting, self-activation, plan changes, cancellation, payment, eSIM, bundles, etc.).',
    parameters: { type: 'OBJECT', properties: { keyword: { type: 'STRING', description: 'Korean keyword or short question' } }, required: ['keyword'] },
  },
];

/** 휴대폰 판매가 준비 중이면 AI 가 휴대폰을 안내할 때 맨 앞에 붙는 말 */
const soonNote = () => (PHONES_COMING_SOON ? `${PHONES_SOON_AI_NOTE}\n` : '');

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
const str = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 60) : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

function planLine(p: Plan) {
  const parts = [
    `id=${p.id}`,
    p.name,
    p.network,
    (p.billing ?? 'post') === 'prepaid' ? '선불' : '후불',
    `데이터 ${p.dataLabel}`,
    `음성 ${p.voice}`,
    `문자 ${p.sms}`,
    `정상가 ${won(p.price)}`,
    `현재 월 ${won(p.promoPrice)}`,
  ];
  if (p.promoNote) parts.push(`할인: ${p.promoNote}`);
  if (p.features.length) parts.push(`혜택: ${p.features.join(', ')}`);
  if (p.badge) parts.push(`배지: ${p.badge}`);
  return `- ${parts.join(' | ')}`;
}

/** 같은 뜻의 말: 어느 쪽으로 물어도 같은 요금제가 나오게 한다 */
const SYNONYMS: string[][] = [
  ['국제전화', '국제통화', '해외통화', '해외전화', '글로벌통화', '00700'],
  ['무료충전', '무료충전', '2개월무료', '3개월무료'],
  ['결합', '인터넷결합', 'kt인터넷', '인터넷결합할인'],
  ['5g', '5지'],
];
function keywordAlternatives(kw: string): string[] {
  const hit = SYNONYMS.find((g) => g.some((w) => kw.includes(w)));
  return hit ? [...new Set([kw, ...hit])] : [kw];
}

async function searchPlans(a: Args): Promise<string> {
  const { plans } = await getPlans();
  const network = str(a.network).toUpperCase().replace('LG U+', 'LGU+').replace('LGU', 'LGU+').replace('LGU++', 'LGU+');
  const billing = str(a.billing).toLowerCase();
  const kw = norm(str(a.keyword));
  const minP = num(a.min_price);
  const maxP = num(a.max_price);
  const minD = num(a.min_data_gb);
  let list = plans.filter(
    (p) =>
      (!network || p.network === network) &&
      (!billing || (p.billing ?? 'post') === (billing.startsWith('pre') ? 'prepaid' : 'post')) &&
      (minP === undefined || p.promoPrice >= minP) &&
      (maxP === undefined || p.promoPrice <= maxP) &&
      (minD === undefined || p.dataGB >= minD) &&
      (!kw || keywordAlternatives(kw).some((k) => norm(`${p.name} ${p.features.join(' ')} ${p.badge ?? ''} ${p.promoNote}`).includes(k))),
  );
  const sort = str(a.sort);
  list = [...list].sort((x, y) =>
    sort === 'data_desc'
      ? y.dataGB - x.dataGB || x.promoPrice - y.promoPrice
      : sort === 'lifetime_discount_first'
        ? Number(y.promoNote === '평생 할인') - Number(x.promoNote === '평생 할인') || x.promoPrice - y.promoPrice
        : x.promoPrice - y.promoPrice || y.dataGB - x.dataGB,
  );
  if (list.length === 0) return '조건에 맞는 요금제가 없습니다. 조건을 넓혀 다시 찾아 보세요.';
  return `조건에 맞는 요금제 ${list.length}개 중 ${Math.min(8, list.length)}개:\n${list.slice(0, 8).map(planLine).join('\n')}`;
}

async function getPlanDetail(a: Args): Promise<string> {
  const q = norm(str(a.name));
  if (!q) return '요금제 이름을 알려 주세요.';
  const { plans } = await getPlans();
  const hit = plans.find((p) => norm(p.id) === q) ?? plans.find((p) => norm(p.name) === q) ?? plans.filter((p) => norm(p.name).includes(q))[0];
  return hit ? planLine(hit) : '해당 이름의 요금제를 찾지 못했습니다. search_plans 로 먼저 찾아 보세요.';
}

async function findPhones(a: Args) {
  const phones = await getProducts();
  const brand = str(a.brand).toLowerCase();
  const kw = norm(str(a.keyword));
  const maxM = num(a.max_monthly);
  const monthly = (price: string) => Number((price.match(/([\d,]+)\s*원/)?.[1] ?? '').replace(/,/g, '')) || Number.POSITIVE_INFINITY;
  return phones
    .filter((p) => {
      const b = PHONE_EXTRAS[p.title]?.brand ?? (p.group === 'iphone' ? 'apple' : 'samsung');
      return (!brand || b === brand || (brand === 'galaxy' && b === 'samsung') || (brand === 'iphone' && b === 'apple')) && (!kw || norm(p.title).includes(kw)) && (maxM === undefined || monthly(p.price) <= maxM);
    })
    .sort((x, y) => monthly(x.price) - monthly(y.price));
}

async function searchPhones(a: Args): Promise<string> {
  const list = await findPhones(a);
  if (list.length === 0) return '조건에 맞는 휴대폰이 없습니다.';
  return `${soonNote()}휴대폰 ${list.length}개 (월 금액이 낮은 순, 24개월 할부 기준 월 최저가):\n${list.map((p) => `- ${p.title} | ${p.price} | ${p.note}${p.badge ? ` | ${p.badge}` : ''}`).join('\n')}`;
}

async function getPhoneDetail(a: Args): Promise<string> {
  const q = norm(str(a.name));
  if (!q) return '휴대폰 이름을 알려 주세요.';
  const phones = await getProducts();
  const p = phones.find((x) => norm(x.title) === q) ?? phones.find((x) => norm(x.title).includes(q));
  if (!p) return '해당 이름의 휴대폰을 찾지 못했습니다. search_phones 로 먼저 찾아 보세요.';
  return phoneDetailText(p);
}

function phoneDetailText(p: Awaited<ReturnType<typeof getProducts>>[number]): string {
  const extra = PHONE_EXTRAS[p.title];
  const rows = p.specs ?? extra?.rows ?? [];
  const isNew = p.isNew ?? extra?.isNew ?? false;
  return [
    soonNote().trim(),
    `${p.title} | ${p.price} | ${p.note}`,
    p.description ? `설명: ${p.description}` : '',
    rows.length ? `사양:\n${rows.map(([k, v]) => `  · ${k}: ${v}`).join('\n')}` : '사양 정보가 아직 없습니다.',
    isNew ? `상품 구성: ${['단말기', ...PHONE_INCLUDES].join(', ')}` : '',
    `교환·반품 안내:\n${PHONE_POLICY.map((l) => `  · ${l}`).join('\n')}`,
    p.official ?? extra?.official ? `제조사 공식 페이지: ${p.official ?? extra?.official}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function searchFaq(a: Args, ctx: Ctx): Promise<string> {
  const kw = norm(str(a.keyword));
  const faqs = await getFaqsForLang(ctx.korean ? 'ko' : 'en');
  const words = str(a.keyword).split(/\s+/).filter((w) => w.length > 1).map(norm);
  const scored = faqs
    .map((f) => {
      const text = norm(`${f.category} ${f.q} ${f.a}`);
      return { f, score: (kw && text.includes(kw) ? 3 : 0) + words.filter((w) => text.includes(w)).length };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 4);
  if (scored.length === 0) return '관련 FAQ가 없습니다. 모르는 내용은 직원이 확인해 드린다고 안내하세요.';
  return scored.map(({ f }) => `Q. ${f.q}\nA. ${f.a}`).join('\n\n');
}

// ---------------------------------------------------------------------------
// 사이트 안내 페이지 · 이벤트 · 공지 · 회사 정보
// ---------------------------------------------------------------------------
/** korean: 한국인 고객용 문구(locales/ko.json 의 "원문 → 한국인용 문구")를 쓰고 외국인 전용 항목은 뺀다 */
interface Ctx {
  korean: boolean;
}

const FOREIGN_ONLY = /(국제통화|어떤 언어를 지원|국적|모국어 선택)/;
const SHORT = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s);

/** 블록 본문을 글로 펴 준다. tr 은 문장 하나하나에 먼저 적용한다 (한국인용 문구 사전은 문장 단위로 되어 있다) */
function flatten(blocks: Block[], tr: (s: string) => string = (s) => s): string {
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === 'notice') out.push(`[안내] ${tr(b.text)}`);
    else if (b.type === 'text') out.push([b.heading, ...b.paragraphs].filter(Boolean).map((s) => tr(s as string)).join(' '));
    else if (b.type === 'cards') out.push(b.items.map((i) => `${tr(i.title)}: ${tr(i.desc)}`).join(' / '));
    else if (b.type === 'steps') out.push(`${tr(b.heading ?? '순서')}: ${b.items.map((i, n) => `${n + 1}) ${tr(i.title)} - ${tr(i.desc)}`).join(' ')}`);
    else if (b.type === 'table') out.push(`${b.heading ? tr(b.heading) : ''} ${b.rows.map((r) => r.map(tr).join(' | ')).join(' ; ')}`.trim());
    else if (b.type === 'faq') out.push(b.items.map((i) => `Q ${tr(i.q)} A ${tr(i.a)}`).join(' '));
    else if (b.type === 'links') out.push(`${tr(b.heading ?? '링크')}: ${b.items.map((i) => tr(i.label)).join(', ')}`);
    else if (b.type === 'cta') out.push(`${tr(b.title)} ${tr(b.desc)}`);
  }
  return out.join('\n');
}

const koText = (ctx: Ctx) => {
  const dict = ctx.korean ? dictionaryOf('ko') : {};
  return (s: string) => dict[s] ?? s;
};

/** 문장 단위로 외국인 전용 문장을 빼고(한국인용일 때), 한국인용 문구로 바꾼다 */
const clean = (text: string, ctx: Ctx) => {
  const tr = koText(ctx);
  return text
    .split('\n')
    .filter((l) => !(ctx.korean && FOREIGN_ONLY.test(l)))
    .map((l) => {
      const out = tr(l);
      // 사전에 없는 문장에 남은 외국인등록증은 한국인 고객에게는 신분증으로 말한다
      return ctx.korean ? out.replace(/외국인\s?등록증(\s?\(ARC\))?/g, '신분증') : out;
    })
    .join('\n');
};

interface PageEntry {
  path: string;
  title: string;
  text: string;
}

/**
 * 모든 안내 페이지의 제목·본문. 전화에서는 바로 대답해야 하므로 페이지를 한꺼번에 읽고
 * 5분 동안 기억해 둔다 (관리자에서 바꾼 내용은 최대 5분 안에 반영된다).
 */
const PAGE_INDEX_TTL_MS = 5 * 60 * 1000;
const pageIndexCache = new Map<string, { at: number; promise: Promise<PageEntry[]> }>();

function pageIndex(ctx: Ctx): Promise<PageEntry[]> {
  const key = ctx.korean ? 'ko' : 'foreign';
  const hit = pageIndexCache.get(key);
  if (hit && Date.now() - hit.at < PAGE_INDEX_TTL_MS) return hit.promise;
  const promise = (async () => {
    const paths = [...PAGES.map((p) => p.path), ...(await getCustomPagePaths()), ...DEDICATED_PAGES.map((d) => d.path)];
    const unique = [...new Set(paths)];
    const entries = await Promise.all(
      unique.map(async (path) => {
        const t = await pageText(path, ctx);
        return t ? { path, title: koText(ctx)(t.title), text: t.text } : null;
      }),
    );
    return entries.filter((e): e is PageEntry => e !== null);
  })();
  pageIndexCache.set(key, { at: Date.now(), promise });
  // 실패하면 기억하지 않는다
  promise.catch(() => pageIndexCache.delete(key));
  return promise;
}

async function pageText(path: string, ctx: Ctx): Promise<{ title: string; text: string } | null> {
  const page = await getContentPage(path);
  if (page) {
    const tr = koText(ctx);
    return { title: page.title, text: clean([page.lead ? tr(page.lead) : '', flatten(page.blocks, tr)].filter(Boolean).join('\n'), ctx) };
  }
  if (DEDICATED_PAGES.some((d) => d.path === path)) {
    const meta = await getPageMeta(path);
    return { title: meta.title, text: clean(meta.lead, ctx) };
  }
  return null;
}

async function listPages(ctx: Ctx): Promise<string> {
  const lines = (await pageIndex(ctx))
    .filter((p) => !(ctx.korean && FOREIGN_ONLY.test(p.title)))
    .map((p) => `- ${p.path} | ${p.title} | ${SHORT(p.text.replace(/\n/g, ' '), 80)}`);
  return `홈페이지 안내 페이지 ${lines.length}개:\n${lines.join('\n')}`;
}

async function searchPages(a: Args, ctx: Ctx): Promise<string> {
  const kw = norm(str(a.keyword));
  const words = str(a.keyword).split(/\s+/).filter((w) => w.length > 1).map(norm);
  if (!kw) return '검색어를 알려 주세요.';
  const hits: { path: string; title: string; text: string; score: number }[] = [];
  for (const p of await pageIndex(ctx)) {
    const hay = norm(`${p.title} ${p.text}`);
    const score = (hay.includes(kw) ? 3 : 0) + words.filter((w) => hay.includes(w)).length + (norm(p.title).includes(kw) ? 3 : 0);
    if (score > 0) hits.push({ path: p.path, title: p.title, text: p.text, score });
  }
  hits.sort((x, y) => y.score - x.score);
  if (hits.length === 0) return '관련 페이지가 없습니다. 직원이 확인해 드린다고 안내하세요.';
  // 페이지 전체가 아니라 질문 단어가 들어 있는 줄만 꺼낸다 (없으면 맨 앞 두 줄)
  const terms = [kw, ...words];
  const relevant = (text: string) => {
    const lines = text.split('\n').filter(Boolean);
    const picked = lines.filter((l) => terms.some((t) => norm(l).includes(t)));
    return SHORT((picked.length ? picked : lines.slice(0, 2)).join('\n'), 500);
  };
  return hits.slice(0, 3).map((h) => `## ${h.title} (${h.path})\n${relevant(h.text)}`).join('\n\n');
}

async function getPageDetail(a: Args, ctx: Ctx): Promise<string> {
  const q = str(a.page);
  const pages = await pageIndex(ctx);
  const hit = pages.find((p) => p.path === q) ?? pages.find((p) => norm(p.title) === norm(q)) ?? pages.find((p) => norm(p.title).includes(norm(q)));
  if (!hit) return '해당 페이지를 찾지 못했습니다. list_pages 로 먼저 찾아 보세요.';
  return `## ${hit.title} (${hit.path})\n${SHORT(hit.text, 1800)}`;
}

async function eventsText(kind: 'events' | 'notices', ctx: Ctx): Promise<string> {
  const posts = await (kind === 'events' ? getEvents() : getNotices());
  const list = posts.filter((p) => !(ctx.korean && FOREIGN_ONLY.test(`${p.title} ${p.body.join(' ')}`))).slice(0, 6);
  if (list.length === 0) return kind === 'events' ? '진행 중인 이벤트가 없습니다.' : '등록된 공지가 없습니다.';
  const tr = koText(ctx);
  return list.map((p) => `- ${tr(p.title)}${p.period ? ` (기간: ${p.period})` : ''} [${p.date}]\n  ${SHORT(p.body.map(tr).join(' '), 300)}`).join('\n');
}

async function companyInfo(): Promise<string> {
  const { footer } = await getSiteSettings();
  const c = footer.company;
  return [
    `상호: ${c.name}`,
    `대표: ${c.ceo}`,
    `주소: ${c.address}`,
    `대표 연락처: ${c.phone}`,
    `이메일: ${c.email}`,
    c.bizNumber ? `사업자등록번호: ${c.bizNumber}` : '',
    c.salesNumber ? `통신판매업 신고번호: ${c.salesNumber}` : '',
    '상담: 홈페이지의 1:1 상담문의나 가입 신청서를 남기시면 상담원이 연락드립니다.',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function runTool(name: string, args: Args, ctx: Ctx = { korean: true }): Promise<string> {
  try {
    switch (name) {
      case 'list_pages':
        return await listPages(ctx);
      case 'search_pages':
        return await searchPages(args, ctx);
      case 'get_page':
        return await getPageDetail(args, ctx);
      case 'get_events':
        return await eventsText('events', ctx);
      case 'get_notices':
        return await eventsText('notices', ctx);
      case 'get_company_info':
        return await companyInfo();
      case 'search_plans':
        return await searchPlans(args);
      case 'get_plan':
        return await getPlanDetail(args);
      case 'search_phones':
        return await searchPhones(args);
      case 'get_phone':
        return await getPhoneDetail(args);
      case 'search_faq':
        return await searchFaq(args, ctx);
      default:
        return '알 수 없는 도구입니다.';
    }
  } catch {
    return '정보를 불러오지 못했습니다. 직원이 확인해 드린다고 안내하세요.';
  }
}

// ---------------------------------------------------------------------------
// 전화 상담용 스냅샷: 전화 프로그램이 켜질 때 한 번에 받아 메모리에 올려 두고, 이후에는 인터넷 없이 바로 찾는다
// ---------------------------------------------------------------------------
/** 전화 프로그램이 받아 가는 전체 내용은 서버에서 10분 동안 만들어 둔 것을 그대로 준다 (DB 를 다시 읽지 않는다) */
const SNAPSHOT_TTL_MS = 10 * 60 * 1000;
const snapGlobal = globalThis as unknown as { __ktSnapshot?: { at: number; promise: Promise<Awaited<ReturnType<typeof makeSnapshot>>> } };

export function buildSnapshot() {
  const hit = snapGlobal.__ktSnapshot;
  if (hit && Date.now() - hit.at < SNAPSHOT_TTL_MS) return hit.promise;
  const promise = makeSnapshot();
  snapGlobal.__ktSnapshot = { at: Date.now(), promise };
  promise.catch(() => {
    snapGlobal.__ktSnapshot = undefined;
  });
  return promise;
}

async function makeSnapshot() {
  const ko: Ctx = { korean: true };
  const fo: Ctx = { korean: false };
  const [{ plans }, phones, faqKo, faqFo, pagesKo, pagesFo, eventsKo, eventsFo, noticesKo, noticesFo, company] = await Promise.all([
    getPlans(),
    getProducts(),
    getFaqsForLang('ko'),
    getFaqsForLang('en'),
    pageIndex(ko),
    pageIndex(fo),
    eventsText('events', ko),
    eventsText('events', fo),
    eventsText('notices', ko),
    eventsText('notices', fo),
    companyInfo(),
  ]);
  const monthly = (price: string) => Number((price.match(/([\d,]+)\s*원/)?.[1] ?? '').replace(/,/g, '')) || null;
  return {
    generatedAt: new Date().toISOString(),
    phoneNotice: soonNote().trim(),
    plans: plans.map((p) => ({
      id: p.id,
      name: p.name,
      network: p.network,
      billing: p.billing ?? 'post',
      dataGB: p.dataGB,
      promoPrice: p.promoPrice,
      promoNote: p.promoNote,
      features: p.features,
      badge: p.badge ?? '',
      line: planLine(p),
    })),
    phones: phones.map((p) => ({
      title: p.title,
      brand: PHONE_EXTRAS[p.title]?.brand ?? (p.group === 'iphone' ? 'apple' : 'samsung'),
      monthly: monthly(p.price),
      line: `- ${p.title} | ${p.price} | ${p.note}${p.badge ? ` | ${p.badge}` : ''}`,
      detail: phoneDetailText(p),
    })),
    faqs: {
      korean: faqKo.map((f) => ({ category: f.category, q: f.q, a: f.a })),
      foreign: faqFo.map((f) => ({ category: f.category, q: f.q, a: f.a })),
    },
    pages: { korean: pagesKo, foreign: pagesFo },
    events: { korean: eventsKo, foreign: eventsFo },
    notices: { korean: noticesKo, foreign: noticesFo },
    company,
  };
}
