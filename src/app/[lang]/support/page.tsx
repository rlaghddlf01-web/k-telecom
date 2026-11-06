import { redirect } from 'next/navigation';
import { isLang, localizePath } from '@/lib/langs';

export default async function SupportIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(localizePath('/support/notice', isLang(lang) ? lang : 'ko'));
}