// 언어별 번역 사전 (서버 전용). 키는 한국어 문장 자체이고, 사전에 없으면 한국어가 그대로 나온다.
import 'server-only';
import type { Lang } from '@/lib/langs';
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

const DICTS: Record<Exclude<Lang, 'ko'>, Dictionary> = { en, ja, ru, vi, zh, th, uz, km, mn, ne, id, my, si, kk, bn, ur, tl };

export const dictionaryOf = (lang: Lang): Dictionary => (lang === 'ko' ? {} : DICTS[lang]);
