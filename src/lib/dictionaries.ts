// 언어별 번역 사전 (서버 전용). 키는 한국어 문장 자체이고, 사전에 없으면 한국어가 그대로 나온다.
import 'server-only';
import type { Lang } from '@/lib/langs';
import ko from '@/locales/ko.json';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';
import ru from '@/locales/ru.json';
import vi from '@/locales/vi.json';
import zh from '@/locales/zh.json';
import th from '@/locales/th.json';
import uz from '@/locales/uz.json';
import km from '@/locales/km.json';
import mn from '@/locales/mn.json';
import ne from '@/locales/ne.json';
import id from '@/locales/id.json';
import my from '@/locales/my.json';
import si from '@/locales/si.json';
import kk from '@/locales/kk.json';
import bn from '@/locales/bn.json';
import ur from '@/locales/ur.json';
import tl from '@/locales/tl.json';

export type Dictionary = Record<string, string>;

const DICTS: Record<Exclude<Lang, 'ko' | 'kr'>, Dictionary> = { en, ja, ru, vi, zh, th, uz, km, mn, ne, id, my, si, kk, bn, ur, tl };

// 한국어(/)는 한국인용으로 바꾼 문구(ko.json: "원문 → 한국인용 문구")를 쓰고, 목록에 없는 문구는 원문 그대로 나온다.
// 원문 화면(/kr)은 아무것도 바꾸지 않는다.
export const dictionaryOf = (lang: Lang): Dictionary => (lang === 'kr' ? {} : lang === 'ko' ? ko : DICTS[lang]);
