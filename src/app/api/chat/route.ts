import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/server/security';
import { getChatSettings, getPlans, getProducts } from '@/lib/content/load';
import { TOOL_DECLARATIONS, runTool } from '@/lib/server/chatTools';
import { buildTelecomChatSystemPrompt } from '@/lib/server/chatPersona';
import { helpById } from '@/lib/content/chatContext';
import { dictionaryOf } from '@/lib/dictionaries';
import { isLang, langInfo, type Lang } from '@/lib/langs';

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const MAX_HISTORY = 10;

/** 자주 묻는 질문(대화 첫 질문)의 답은 1시간 동안 재사용한다: 같은 질문마다 AI 사용료를 쓰지 않도록 */
const CACHE_TTL_MS = 60 * 60 * 1000;
const answerCache = new Map<string, { answer: string; at: number }>();

interface Turn {
  role: 'user' | 'model';
  text: string;
}

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');

/** 요금제·단말 전체를 프롬프트에 넣지 않고, 개수만 알려 준다. 자세한 내용은 AI 가 도구(chatTools)로 찾아 쓴다 */
async function catalogText(): Promise<string> {
  const [{ plans }, phones] = await Promise.all([getPlans(), getProducts()]);
  return [
    `The shop has ${plans.length} mobile plans and ${phones.length} phones registered. You do NOT have them memorised.`,
    'NEVER say you will "check" or "look it up" without calling a tool in that same turn, and NEVER say a kind of plan or product does not exist unless search_plans / search_phones / search_pages actually returned nothing for it. If unsure whether something exists (for example prepaid free-charge plans, international-call plans, internet bundles), search first.',
    'ALWAYS call a tool before answering about any plan, price, data amount, carrier, discount, phone, phone spec, box contents, return policy, bundle (internet/TV combination) or FAQ-type question:',
    '- search_plans: find plans by carrier, prepaid/postpaid, price range, data, or a Korean keyword (e.g. 결합, eSIM, 평생). Use min_price/max_price for "만원대" (10000-19999).',
    '- get_plan: full detail of one plan.',
    '- search_phones / get_phone: phones, monthly price, specs, box contents, return policy.',
    '- search_faq: sign-up documents, activation, number porting, self-activation, cancellation, payment, etc.',
    '- search_pages / get_page / list_pages: any other website information (self-activation, add-ons, phone installments, internet, IPTV, forms, guides, order status, terms, privacy).',
    '- get_events / get_notices / get_company_info: current events, notices, company and contact details.',
    'PHONES: phone sales are currently "coming soon" (준비 중). When a customer asks about phones, say first that phone sales are being prepared and are not available to buy or apply for yet; you may share the listed models and monthly prices only as reference. Never offer to start a phone order.',
    'PRICE RANGES: "만원대" means 10,000–19,999 won, so set BOTH min_price=10000 and max_price=19999; "2만원대" is 20,000–29,999. Never recommend a plan whose current monthly price is outside the range the customer asked for.',
    'VOICE WORDING: quote voice/SMS exactly as returned, e.g. "기본제공 (부가 300분)". NEVER explain 기본제공 as "unlimited" (무제한) — the plan data does not say that.',
    'Tool results are in Korean. Translate them into the customer\'s language when you answer. Quote prices and names exactly as returned; never invent any. If a tool returns nothing relevant, say staff will confirm. For bundle (결합) questions, only state what appears in plan perks or FAQ results.',
  ].join('\n');
}

function systemPrompt(managerName: string, language: string, topic: string, catalog: string, korean: boolean) {
  return buildTelecomChatSystemPrompt({ managerName, language, topic, catalog, korean });
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 503 });

  // 같은 곳에서 너무 자주 부르면 막는다 (AI 사용료 보호)
  if (!rateLimit(`chat:${clientIp(req)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const message = clip(body?.message, 600);
  if (!message) return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });

  const history: Turn[] = (Array.isArray(body?.history) ? body.history : [])
    .slice(-MAX_HISTORY)
    .map((h: { role?: unknown; text?: unknown }) => ({ role: h?.role === 'model' ? 'model' : 'user', text: clip(h?.text, 600) }))
    .filter((h: Turn) => h.text);

  const lang = isLang(body?.lang) ? body.lang : 'ko';
  // 화면이 보낸 페이지 id 는 정해진 목록에 있는 것만 인정한다 (그 화면의 설명은 서버가 가진 것만 쓴다)
  const help = helpById(body?.ctx);
  const settings = await getChatSettings();
  if (!settings.aiEnabled) return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 503 });

  // 대화 첫 질문이 자주 묻는 질문이면 저장해 둔 답을 먼저 쓴다
  const dict = dictionaryOf(lang);
  const isQuick = history.length === 0 && help.chips.some((q) => (dict[q] ?? q) === message);
  const cacheKey = `${lang}:${help.id}:${message}`;
  if (isQuick) {
    const hit = answerCache.get(cacheKey);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return NextResponse.json({ answer: hit.answer });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 40_000);
  try {
    const systemInstruction = { parts: [{ text: systemPrompt(settings.managerName, langInfo(lang).name, help.topic, await catalogText(), lang === 'ko') }] };
    const contents: { role: string; parts: unknown[] }[] = [...history, { role: 'user', text: message }].map((t) => ({ role: t.role, parts: [{ text: t.text }] }));

    // AI 가 도구를 부르면 결과를 돌려주고 다시 묻는다 (최대 4번). 도구를 더 부르지 않으면 그 답이 최종 답이다.
    let data: { candidates?: { content?: { parts?: { text?: string; functionCall?: { name: string; args?: Record<string, unknown> } }[] } }[] } = {};
    for (let round = 0; round < 5; round += 1) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction,
          contents,
          // 마지막 차례에는 도구 없이 답만 하게 한다
          ...(round < 4 ? { tools: [{ functionDeclarations: TOOL_DECLARATIONS }] } : {}),
          // 첫 차례에는 (짧은 인사가 아니면) 반드시 도구로 찾아 보고 답하게 한다. 도구 없이 일반 지식으로 답하면 정책과 다른 말을 한다.
          ...(round === 0 && message.length >= 8 ? { toolConfig: { functionCallingConfig: { mode: 'ANY' } } } : {}),
          generationConfig: { maxOutputTokens: 700, temperature: 0.6 },
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        console.error('chat model error status:', res.status, String(detail?.error?.message ?? '').slice(0, 200));
        return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 502 });
      }
      data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const calls = parts.filter((p) => p.functionCall);
      if (calls.length === 0) break;
      // 모델이 보낸 내용을 그대로 이어 붙이고(서명 포함), 도구 결과를 사용자 차례로 돌려준다
      contents.push({ role: 'model', parts });
      const results = await Promise.all(calls.map((c) => runTool(c.functionCall!.name, c.functionCall!.args ?? {}, { korean: lang === 'ko' })));
      contents.push({
        role: 'user',
        parts: calls.map((c, i) => ({ functionResponse: { name: c.functionCall!.name, response: { result: results[i] } } })),
      });
    }
    // 줄바꿈은 살리고 제어 문자만 제거한다
    const answer = (data?.candidates?.[0]?.content?.parts ?? [])
      .map((p: { text?: string }) => p?.text ?? '')
      .join('')
      .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '')
      .trim()
      .slice(0, 1500);
    if (!answer) return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 502 });
    if (isQuick) {
      if (answerCache.size > 200) answerCache.clear();
      answerCache.set(cacheKey, { answer, at: Date.now() });
    }
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('chat error:', err instanceof Error ? err.name : 'unknown');
    return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
