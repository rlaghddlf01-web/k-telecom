import { Wifi, CardSim } from 'lucide-react';
import PhoneMockup from '@/components/PhoneMockup';
import SmartLink from '@/components/SmartLink';
import { themeOf } from '@/lib/content/themes';
import type { Banner } from '@/lib/content/types';

const COLUMNS = ['md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3'];

/** 홈 중간의 가로 배너(최대 3칸). 관리자의 [중간 배너]에서 수정 */
export default function PromoBanners({ banners }: { banners: Banner[] }) {
  const list = banners.slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className={`grid ${COLUMNS[list.length - 1]}`}>
      {list.map((b, i) => (
        <SmartLink
          key={b.id}
          href={b.link_url || '#'}
          className={`group relative flex min-h-[190px] items-center overflow-hidden bg-gradient-to-br ${themeOf(b.theme).bg} px-8 text-white`}
        >
          {b.image_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
            </>
          )}
          <div className="relative">
            <h3 className="text-2xl font-black tracking-tight">{b.title}</h3>
            {b.description && <p className="mt-1 text-sm text-white/90">{b.description}</p>}
            {b.button_label && (
              <span className="mt-4 inline-flex rounded-md bg-white px-4 py-1.5 text-xs font-extrabold text-ink">{b.button_label}</span>
            )}
          </div>
          {!b.image_url && i % 3 === 0 && (
            <PhoneMockup kind="island" from="#1e1b4b" to="#fb923c" className="absolute -right-2 -bottom-10 h-56 rotate-[14deg] transition-transform group-hover:rotate-[8deg]" />
          )}
          {!b.image_url && i % 3 === 1 && (
            <CardSim className="absolute -right-4 -bottom-6 h-44 w-44 rotate-[-12deg] text-white/20 transition-transform group-hover:rotate-0" strokeWidth={1.2} />
          )}
          {!b.image_url && i % 3 === 2 && (
            <Wifi className="absolute -right-4 -bottom-6 h-44 w-44 text-white/20 transition-transform group-hover:scale-110" strokeWidth={1.2} />
          )}
        </SmartLink>
      ))}
    </section>
  );
}
