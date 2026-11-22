import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookOpen, ChevronRight, HelpCircle, Info } from 'lucide-react';
import Link from '@/components/LocaleLink';
import PageShell from '@/components/PageShell';
import { GUIDES, absoluteUrl, getGuide, guideAlternates, guideLangFor, guideUi, jsonLd } from '@/lib/guides';
import { getLang, setLang, withLang } from '@/lib/i18n';
import { isLang } from '@/lib/langs';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

// 가이드 주소는 미리 정해진 글만 있다 (언어는 레이아웃이 정한 대로)
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const guide = getGuide(slug);
  if (!guide || !isLang(lang)) return {};
  setLang(lang);
  const c = guide.content[guideLangFor(lang)];
  const path = `/guide/${guide.slug}`;
  return {
    title: `${c.title} | K-Telecom`,
    description: c.description,
    alternates: guideAlternates(path, lang),
    openGraph: {
      type: 'article',
      title: c.title,
      description: c.description,
      url: absoluteUrl(path, lang),
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
  };
}

async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const lang = getLang();
  const gl = guideLangFor(lang);
  const ui = guideUi(gl);
  const c = guide.content[gl];
  const path = `/guide/${guide.slug}`;
  const url = absoluteUrl(path, gl);
  const related = guide.related.map(getGuide).filter((g): g is NonNullable<typeof g> => !!g);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.description,
    inLanguage: gl,
    datePublished: guide.published,
    dateModified: guide.updated,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'K-Telecom' },
    publisher: { '@type': 'Organization', name: 'K-Telecom' },
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: gl,
    mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <PageShell path={path} title={c.title} lead={c.description}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd) }} />

      <article lang={gl} className="max-w-3xl space-y-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <Link href="/guide" className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 font-bold text-brand hover:bg-brand hover:text-white">
            <BookOpen className="h-3.5 w-3.5" />
            {ui.guides}
          </Link>
          <span>
            {ui.updated} <time dateTime={guide.updated}>{guide.updated}</time>
          </span>
        </div>

        {c.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-3 text-xl font-black tracking-tight">{s.heading}</h2>
            <p className="text-[15px] leading-relaxed text-slate-700">{s.body}</p>
          </section>
        ))}

        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{ui.note}</p>
        </div>

        {c.faq.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-black tracking-tight">{ui.faq}</h2>
            <ul className="space-y-3">
              {c.faq.map((f) => (
                <li key={f.q} className="rounded-2xl bg-soft p-5">
                  <p className="flex items-start gap-2 text-sm font-extrabold">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {f.q}
                  </p>
                  <p className="mt-2 pl-6 text-sm leading-relaxed text-slate-600">{f.a}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-7 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-black">{ui.ctaTitle}</p>
            <p className="mt-1 text-sm text-white/65">{ui.ctaText}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/plans" className="rounded-full bg-brand px-6 py-3 text-sm font-bold hover:bg-brand-dark">
              {ui.plans}
            </Link>
            <Link href="/phones" className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold ring-1 ring-white/25 hover:bg-white/20">
              {ui.phones}
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-black">{ui.related}</h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guide/${g.slug}`} className="block h-full rounded-2xl bg-soft p-4 text-sm font-bold leading-snug transition-colors hover:text-brand">
                    {g.content[gl].title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/guide" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">
              {ui.allGuides}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        )}
      </article>
    </PageShell>
  );
}

export default withLang(GuidePage);
