import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import PhonesCatalog from '@/components/PhonesCatalog';
import { ExtraDict } from '@/components/LangProvider';
import { getProducts } from '@/lib/content/load';
import { t, withLang } from '@/lib/i18n';
import { PHONES_COMING_SOON, PHONES_SOON_NOTICE } from '@/lib/phoneStatus';
import { primeTranslations } from '@/lib/server/prime';

const LEAD = '삼성 갤럭시·애플 아이폰 새 제품과 중고 단말을 24개월 할부로 만나보세요.';

export const generateMetadata = pageMeta('단말 목록 | K-Telecom', LEAD);

async function PhonesPage() {
  const phones = await getProducts();
  // 새로 올린 휴대폰의 이름·문구는 번역 저장소에서 꺼내거나 번역해서 저장해 두고, 목록(클라이언트 화면)에도 넘긴다
  const extra = await primeTranslations([...phones.flatMap((p) => [p.title, p.tag, p.note, p.badge ?? '']), PHONES_SOON_NOTICE]);

  return (
    <PageShell path="/phones" managed title="단말 목록" lead={LEAD}>
      {PHONES_COMING_SOON && (
        <p className="mb-6 rounded-2xl bg-amber-50 px-5 py-4 text-sm font-bold leading-relaxed text-amber-900 ring-1 ring-amber-200" role="status">
          {t(PHONES_SOON_NOTICE)}
        </p>
      )}
      <ExtraDict extra={extra}>
        <PhonesCatalog phones={phones} />
      </ExtraDict>
    </PageShell>
  );
}

export default withLang(PhonesPage);
