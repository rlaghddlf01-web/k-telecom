import Link from '@/components/LocaleLink';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import FaqBoard from '@/components/FaqBoard';
import { getFaqs } from '@/lib/content/load';
import { t, withLang } from '@/lib/i18n';

export const generateMetadata = pageMeta('자주 묻는 질문 | K-Telecom');

async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <PageShell path="/support/faq" managed title="자주 묻는 질문">
      <FaqBoard faqs={faqs} />
      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-7 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-black">{t('원하는 답을 찾지 못하셨나요?')}</p>
          <p className="mt-1 text-sm text-white/65">{t('남겨주신 연락처로 담당자가 안내해 드립니다.')}</p>
        </div>
        <Link href="/support/inquiry" className="shrink-0 rounded-full bg-brand px-7 py-3 text-sm font-bold hover:bg-brand-dark">
          {t('1:1 상담문의')}
        </Link>
      </div>
    </PageShell>
  );
}

export default withLang(FaqPage);
