import { t } from '@/lib/i18n';
import PhoneMockup from '@/components/PhoneMockup';
import SmartLink from '@/components/SmartLink';
import { themeOf } from '@/lib/content/themes';
import type { Banner } from '@/lib/content/types';

/** 홈 아래쪽 큰 가로 배너. 관리자의 [하단 배너]에서 수정 */
export default function ShowcaseBanner({ banner }: { banner?: Banner }) {
  if (!banner) return null;
  const theme = themeOf(banner.theme);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${theme.bg} px-8 py-12 text-white md:px-16`}>
        <div className="absolute right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl" style={{ background: theme.glow }} />
        <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            {banner.eyebrow && <p className="text-xs font-bold tracking-[0.3em] text-white/55">{t(banner.eyebrow)}</p>}
            <h2 className="mt-3 whitespace-pre-line text-3xl font-black leading-tight md:text-4xl">{t(banner.title)}</h2>
            {banner.description && <p className="mt-4 text-sm leading-relaxed text-white/70">{t(banner.description)}</p>}
            {banner.link_url && banner.button_label && (
              <SmartLink
                href={banner.link_url}
                className="mt-7 inline-flex rounded-md bg-white px-6 py-3 text-xs font-extrabold text-ink hover:bg-brand hover:text-white transition-colors"
              >
                {t(banner.button_label)}
              </SmartLink>
            )}
          </div>

          <div className="relative flex h-72 items-center justify-center md:h-96">
            {banner.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={banner.image_url} alt="" className="relative max-h-full max-w-full rounded-2xl object-contain" />
            ) : (
              <>
                <PhoneMockup kind={theme.phones[0].kind} from={theme.phones[0].from} to={theme.phones[0].to} className="absolute left-[8%] h-64 -rotate-[10deg] drop-shadow-[0_28px_30px_rgba(0,0,0,0.55)] md:h-80" />
                <PhoneMockup kind={theme.phones[1].kind} from={theme.phones[1].from} to={theme.phones[1].to} className="relative z-10 h-72 rotate-[6deg] drop-shadow-[0_28px_30px_rgba(0,0,0,0.55)] md:h-96" />
                <PhoneMockup kind="punch" from="#f59e0b" to="#e8174f" className="absolute right-[6%] h-60 rotate-[16deg] drop-shadow-[0_28px_30px_rgba(0,0,0,0.55)] md:h-72" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
