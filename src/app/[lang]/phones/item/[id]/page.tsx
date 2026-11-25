import type { Metadata } from 'next';
import Link from '@/components/LocaleLink';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProductImage from '@/components/ProductImage';
import { getProduct, getProducts } from '@/lib/content/load';
import { t, withLang } from '@/lib/i18n';
import { PHONE_INCLUDES, PHONE_POLICY } from '@/lib/phoneExtras';
import { phonePrice } from '@/lib/planText';
import { PHONES_COMING_SOON, PHONES_SOON_NOTICE } from '@/lib/phoneStatus';
import { primeTranslations } from '@/lib/server/prime';

interface Props {
  params: Promise<{ id: string }>;
}

// 관리자에서 새 상품을 올리면 미리 만들어 두지 않은 주소도 열려야 하므로 dynamicParams 를 막지 않는다.
export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const phone = await getProduct(id);
  return phone ? { title: `${t(phone.title)} | K-Telecom`, description: phone.note || phone.description } : {};
}

/** 사양 값: "지원" 같은 낱말만 번역하고, 숫자·영문 값은 모든 언어에서 그대로 보인다 */
const specValue = (v: string) => t(v);

async function PhoneDetailPage({ params }: Props) {
  const { id } = await params;
  const phone = await getProduct(id);
  if (!phone) notFound();

  const related = (await getProducts()).filter((p) => p.group === phone.group && p.id !== phone.id).slice(0, 3);
  const specs = phone.specs ?? [];

  // 사이트 사전에 없는 문구(새로 올린 휴대폰 이름·설명·사양 등)는 번역 저장소에서 꺼내거나 번역해서 저장해 둔다
  await primeTranslations([
    phone.title,
    phone.tag,
    phone.note,
    phone.badge ?? '',
    PHONES_SOON_NOTICE,
    phone.description ?? '',
    ...specs.flat(),
    ...related.map((p) => p.title),
  ]);

  return (
    <PageShell path="/phones" title={t(phone.title)}>
      {PHONES_COMING_SOON && (
        <p className="mb-6 rounded-2xl bg-amber-50 px-5 py-4 text-sm font-bold leading-relaxed text-amber-900 ring-1 ring-amber-200" role="status">
          {t(PHONES_SOON_NOTICE)}
        </p>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative flex items-center justify-center rounded-3xl bg-soft py-10">
          {phone.badge && (
            <span className="absolute left-5 top-5 rounded-md bg-brand px-2.5 py-1 text-[11px] font-extrabold text-white">
              {t(phone.badge)}
            </span>
          )}
          <ProductImage phone={phone} className="h-80 drop-shadow-[0_26px_26px_rgba(15,20,36,0.3)]" />
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400">{t(phone.tag)}</p>
          <h2 className="mt-1 text-2xl font-black leading-snug">{t(phone.title)}</h2>
          <p className="mt-4 text-3xl font-black text-brand">{phonePrice(phone.price, t)}</p>
          <p className="mt-1 text-sm text-slate-500">{t(phone.note)}</p>
          {phone.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{t(phone.description)}</p>
          )}

          <dl className="mt-6 divide-y divide-black/5 rounded-2xl ring-1 ring-black/10 text-sm">
            {[
              ['결제 방식', '외국인등록증 기반 24개월 통신요금 합산 청구'],
              ['초기비용', '0원'],
              ['수령', '택배 발송'],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[100px_1fr] gap-3 px-4 py-3.5">
                <dt className="font-bold">{t(k)}</dt>
                <dd className="text-slate-600">{t(v)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-slate-400">{t('할부 가능 여부는 심사 결과에 따라 달라질 수 있습니다.')}</p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/support/inquiry"
              className="flex-1 rounded-full bg-brand py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              {t('구매 상담 요청')}
            </Link>
            <Link
              href="/phones/installment"
              className="flex-1 rounded-full border border-black/15 py-3.5 text-center text-sm font-bold transition-colors hover:border-brand hover:text-brand"
            >
              {t('할부 안내')}
            </Link>
          </div>
        </div>
      </div>

      {specs.length > 0 && (
        <section className="mt-12">
          <h3 className="mb-3 text-lg font-black">{t('제품 사양')}</h3>
          <dl className="divide-y divide-black/5 rounded-2xl text-sm ring-1 ring-black/10">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3 sm:grid-cols-[160px_1fr]">
                <dt className="font-bold">{t(k)}</dt>
                <dd className="min-w-0 break-words text-slate-600">{specValue(v)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-slate-400">{t('사양은 제조사 공식 자료 기준이며 모델·용량에 따라 다를 수 있습니다.')}</p>
          {phone.official && (
            <a
              href={phone.official}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-black/15 px-5 py-2.5 text-sm font-bold transition-colors hover:border-brand hover:text-brand"
            >
              {t(phone.tag.includes('애플') ? '애플 공식 페이지에서 자세히 보기' : '삼성 공식 페이지에서 자세히 보기')}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      )}

      {phone.isNew && (
        <section className="mt-10">
          <h3 className="mb-3 text-lg font-black">{t('상품 구성')}</h3>
          <ul className="flex flex-wrap gap-2">
            {PHONE_INCLUDES.map((item) => (
              <li key={item} className="rounded-full bg-soft px-4 py-2 text-sm font-bold text-slate-600">
                {t(item)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h3 className="mb-3 text-lg font-black">{t('교환·반품 안내')}</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-500">
          {PHONE_POLICY.map((line) => (
            <li key={line}>{t(line)}</li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-black">{t('함께 보면 좋은 상품')}</h2>
          <ul className="grid grid-cols-3 gap-3">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/phones/item/${p.id}`}
                  className="block rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-28 items-center justify-center">
                    <ProductImage phone={p} className="h-24 drop-shadow-[0_10px_10px_rgba(15,20,36,0.25)]" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs font-bold">{t(p.title)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link href="/phones" className="mt-10 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> {t('목록으로')}
      </Link>
    </PageShell>
  );
}

export default withLang(PhoneDetailPage);
