// 한국어 문구를 언어별로 번역해서 저장하고 다시 꺼내 쓰는 도우미 (서버 전용).
// 순서: ① 사이트 사전(locales) → ② Supabase 번역 저장소 → ③ 없으면 AI 로 번역해서 저장소에 저장.
// 한글이 들어 있지 않은 글자(숫자·영문 사양 값 등)는 번역하지 않고 그대로 쓴다.
// AI 키가 없거나 실패하면 한국어 원문을 그대로 돌려주며, 다음 방문 때 다시 시도한다.
import 'server-only';
import { dictionaryOf } from '@/lib/dictionaries';
import { getTranslations, saveTranslations } from '@/lib/server/cmsStore';
import { DEFAULT_LANG, SOURCE_LANG, langInfo, type Lang } from '@/lib/langs';

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const HANGUL = /[가-힣]/;
const BATCH = 40;
const MAX_SOURCE = 400;

export const needsTranslation = (text: string) => HANGUL.test(text) && text.length <= MAX_SOURCE;

/** 한 번에 여러 문구를 번역한다. 돌려주는 값은 { 한국어 원문: 번역 } (번역을 못 구한 문구는 들어 있지 않다) */
export async function translateTexts(texts: string[], lang: Lang): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (lang === DEFAULT_LANG || lang === SOURCE_LANG) return result;

  const wanted = [...new Set(texts.map((s) => s.trim()).filter(needsTranslation))];
  if (wanted.length === 0) return result;

  // ① 사이트 사전에 이미 있으면 그대로 쓴다 (화면의 t() 가 처리하므로 여기서는 건너뛴다)
  const dict = dictionaryOf(lang);
  const notInDict = wanted.filter((s) => !dict[s]);
  if (notInDict.length === 0) return result;

  // ② 저장소에서 꺼낸다
  const cached = await getTranslations(lang, notInDict).catch(() => ({}) as Record<string, string>);
  Object.assign(result, cached);
  const missing = notInDict.filter((s) => !cached[s]);
  if (missing.length === 0) return result;

  // ③ 없는 것만 AI 로 번역하고 저장한다
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) return result;
  const language = langInfo(lang).name;
  for (let i = 0; i < missing.length; i += BATCH) {
    const chunk = missing.slice(i, i + BATCH);
    const translated = await callModel(apiKey, language, chunk);
    if (!translated) continue;
    const pairs: Record<string, string> = {};
    chunk.forEach((source, index) => {
      const target = translated[index];
      if (target) pairs[source] = target;
    });
    Object.assign(result, pairs);
    await saveTranslations(lang, pairs, 'ai').catch(() => undefined);
  }
  return result;
}

async function callModel(apiKey: string, language: string, items: string[]): Promise<string[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const prompt =
      `Translate each Korean string in the JSON array into ${language}. ` +
      'These are labels and short notes for a mobile phone / mobile plan shop. Keep brand names, model names, numbers, units and symbols (₩, GB, mAh, 5G, eSIM) as they are. ' +
      'Return ONLY a JSON array of strings with exactly the same length and order. No explanations.\n' +
      JSON.stringify(items);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json', maxOutputTokens: 4000 },
      }),
    });
    if (!res.ok) {
      console.error('translate model error status:', res.status);
      return null;
    }
    const data = await res.json();
    const raw = (data?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p?.text ?? '').join('');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== items.length) return null;
    return parsed.map((v: unknown, i: number) => {
      const s = typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim() : '';
      // 비정상적으로 긴 결과는 버린다
      return s && s.length <= items[i].length * 4 + 80 ? s : '';
    });
  } catch (err) {
    console.error('translate error:', err instanceof Error ? err.name : 'unknown');
    return null;
  } finally {
    clearTimeout(timer);
  }
}
