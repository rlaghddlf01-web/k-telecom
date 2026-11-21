import { getFaqsForLang, getPlans, getProducts } from '@/lib/content/load';
import { PHONE_EXTRAS, PHONE_INCLUDES, PHONE_POLICY } from '@/lib/phoneExtras';
import type { Plan } from '@/lib/plans';

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
    name: 'search_faq',
    description: 'Search the frequently asked questions (sign-up documents, activation, number porting, self-activation, plan changes, cancellation, payment, eSIM, bundles, etc.).',
    parameters: { type: 'OBJECT', properties: { keyword: { type: 'STRING', description: 'Korean keyword or short question' } }, required: ['keyword'] },
  },
];

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
      (!kw || norm(`${p.name} ${p.features.join(' ')} ${p.badge ?? ''}`).includes(kw)),
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
  return `휴대폰 ${list.length}개 (월 금액이 낮은 순, 24개월 할부 기준 월 최저가):\n${list.map((p) => `- ${p.title} | ${p.price} | ${p.note}${p.badge ? ` | ${p.badge}` : ''}`).join('\n')}`;
}

async function getPhoneDetail(a: Args): Promise<string> {
  const q = norm(str(a.name));
  if (!q) return '휴대폰 이름을 알려 주세요.';
  const phones = await getProducts();
  const p = phones.find((x) => norm(x.title) === q) ?? phones.find((x) => norm(x.title).includes(q));
  if (!p) return '해당 이름의 휴대폰을 찾지 못했습니다. search_phones 로 먼저 찾아 보세요.';
  const extra = PHONE_EXTRAS[p.title];
  const rows = p.specs ?? extra?.rows ?? [];
  const isNew = p.isNew ?? extra?.isNew ?? false;
  return [
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

async function searchFaq(a: Args): Promise<string> {
  const kw = norm(str(a.keyword));
  const faqs = await getFaqsForLang('ko');
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

export async function runTool(name: string, args: Args): Promise<string> {
  try {
    switch (name) {
      case 'search_plans':
        return await searchPlans(args);
      case 'get_plan':
        return await getPlanDetail(args);
      case 'search_phones':
        return await searchPhones(args);
      case 'get_phone':
        return await getPhoneDetail(args);
      case 'search_faq':
        return await searchFaq(args);
      default:
        return '알 수 없는 도구입니다.';
    }
  } catch {
    return '정보를 불러오지 못했습니다. 직원이 확인해 드린다고 안내하세요.';
  }
}
