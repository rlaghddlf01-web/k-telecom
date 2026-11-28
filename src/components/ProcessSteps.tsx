import { PROCESS_STEPS } from '@/lib/site';
import { ht } from '@/lib/content/homeText';

export default function ProcessSteps() {
  return (
    <section id="process" className="scroll-mt-20 bg-navy py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="section-title text-center">{ht('가입 순서')}</h2>
        <p className="mt-3 text-center text-sm text-white/65">
          {ht('프리티 가입 화면에서 직접 가입하고, 유심이 도착하면 개통합니다')}
        </p>
        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-black">
                  {i + 1}
                </span>
                <s.icon className="h-5 w-5 text-white/70" />
              </div>
              <h3 className="mt-4 font-bold">{ht(s.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{ht(s.desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
