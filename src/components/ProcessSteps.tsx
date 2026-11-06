import { PROCESS_STEPS } from '@/lib/site';
import { t } from '@/lib/i18n';

export default function ProcessSteps() {
  return (
    <section id="process" className="scroll-mt-20 bg-navy py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="section-title text-center">{t('100% 앱 안에서 비대면 신청')}</h2>
        <p className="mt-3 text-center text-sm text-white/65">
          {t('외부 사이트로 이동하지 않고 모국어로 끝까지 신청합니다')}
        </p>
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-black">
                  {i + 1}
                </span>
                <s.icon className="h-5 w-5 text-white/70" />
              </div>
              <h3 className="mt-4 font-bold">{t(s.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{t(s.desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
