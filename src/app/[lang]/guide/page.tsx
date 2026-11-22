import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import Link from '@/components/LocaleLink';
import PageShell from '@/components/PageShell';
import { GUIDES, absoluteUrl, guideAlternates, guideLangFor, guideUi, jsonLd } from '@/lib/guides';
import { getLang, setLang, withLang } from '@/lib/i18n';
import { isLang } from '@/lib/langs';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  setLang(lang);
  const ui = guideUi(guideLangFor(lang));
  return {
    title: `${ui.guides} | K-Telecom`,
    description: ui.guidesLead,
    alternates: guideAlternates('/guide', lang),
  };
}

function GuideIndexPage() {
  const gl = guideLangFor(getLang());
  const ui = guideUi(gl);

  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: ui.guides,
    itemListElement: GUIDES.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/guide/${g.slug}`, gl),
      name: g.content[gl].title,
    })),
  };

  return (
    <PageShell path="/guide" title={ui.guides} lead={ui.guidesLead}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(listLd) }} />
      <ul lang={gl} className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => {
          const c = g.content[gl];
          return (
            <li key={g.slug}>
              <Link href={`/guide/${g.slug}`} className="group flex h-full flex-col rounded-2xl bg-soft p-6 transition-colors hover:bg-white hover:shadow-md hover:ring-1 hover:ring-brand/30">
                <h2 className="text-base font-extrabold leading-snug group-hover:text-brand">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">
                  {ui.readMore}
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-7 text-white sm:flex-row sm:items-center">
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
    </PageShell>
  );
}

export default withLang(GuideIndexPage);
