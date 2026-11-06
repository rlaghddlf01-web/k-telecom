import Link from '@/components/LocaleLink';
import {
  Truck, Languages, ScanLine, Wrench, Wifi, Tv, Globe2, CardSim, Smartphone, ShieldCheck,
  Headset, Wallet, BadgeCheck, Handshake, Clock, Info, ChevronDown, ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import type { Block, IconName } from '@/lib/pages';
import { t } from '@/lib/i18n';

const ICONS: Record<IconName, LucideIcon> = {
  truck: Truck, languages: Languages, scan: ScanLine, wrench: Wrench, wifi: Wifi, tv: Tv,
  globe: Globe2, sim: CardSim, phone: Smartphone, shield: ShieldCheck, headset: Headset,
  wallet: Wallet, badge: BadgeCheck, handshake: Handshake, clock: Clock,
};

function Heading({ children }: { children?: string }) {
  if (!children) return null;
  return <h2 className="mb-4 text-lg font-black tracking-tight">{t(children)}</h2>;
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'notice':
      return (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{t(block.text)}</p>
        </div>
      );

    case 'text':
      return (
        <div>
          <Heading>{block.heading}</Heading>
          <div className="space-y-2 text-sm leading-relaxed text-slate-600">
            {block.paragraphs.map((p) => (
              <p key={p}>{t(p)}</p>
            ))}
          </div>
        </div>
      );

    case 'cards':
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {block.items.map(({ icon, title, desc }) => {
            const Icon = ICONS[icon];
            return (
              <li key={title} className="rounded-2xl bg-soft p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-extrabold">{t(title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{t(desc)}</p>
              </li>
            );
          })}
        </ul>
      );

    case 'steps':
      return (
        <div>
          <Heading>{block.heading}</Heading>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-black/5 p-5 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-black text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-extrabold">{t(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{t(s.desc)}</p>
              </li>
            ))}
          </ol>
        </div>
      );

    case 'table':
      return (
        <div>
          <Heading>{block.heading}</Heading>
          <div className="overflow-x-auto rounded-2xl ring-1 ring-black/10">
            <table className="w-full text-left text-sm">
              {block.head && (
                <thead className="bg-soft text-xs font-bold text-slate-500">
                  <tr>
                    {block.head.map((h) => (
                      <th key={h} className="px-4 py-3">{t(h)}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-black/5">
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td
                        key={cell + i}
                        className={`px-4 py-3.5 ${!block.head && i === 0 ? 'w-32 bg-soft font-bold' : 'text-slate-600'}`}
                      >
                        {t(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'faq':
      return (
        <ul className="divide-y divide-black/5 rounded-2xl ring-1 ring-black/10">
          {block.items.map((f) => (
            <li key={f.q}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold">
                  <span>
                    <span className="mr-2 text-brand">Q</span>
                    {t(f.q)}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="bg-soft px-5 py-4 text-sm leading-relaxed text-slate-600">{t(f.a)}</p>
              </details>
            </li>
          ))}
        </ul>
      );

    case 'links':
      return (
        <div>
          <Heading>{block.heading}</Heading>
          <ul className="space-y-2">
            {block.items.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                >
                  {t(l.label)} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'cta':
      return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-7 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-black">{t(block.title)}</p>
            <p className="mt-1 text-sm text-white/65">{t(block.desc)}</p>
          </div>
          <Link
            href={block.href}
            className="shrink-0 rounded-full bg-brand px-7 py-3 text-sm font-bold transition-colors hover:bg-brand-dark"
          >
            {t(block.label)}
          </Link>
        </div>
      );
  }
}

export default function PageBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-10">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}
