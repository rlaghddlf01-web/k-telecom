import { ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';
import { PAIN_POINTS } from '@/lib/site';
import { ht } from '@/lib/content/homeText';

export default function PainPoints() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="section-title text-center">{ht('외국인 통신, 이렇게 해결합니다')}</h2>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {PAIN_POINTS.map((p) => (
          <li key={p.problem} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="flex items-start gap-2 text-sm text-slate-500">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> {ht(p.problem)}
            </p>
            <div className="my-3 flex justify-center text-brand">
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
            <p className="flex items-start gap-2 text-sm font-bold">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {ht(p.solution)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
