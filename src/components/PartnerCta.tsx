import Link from '@/components/LocaleLink';
import { ht } from '@/lib/content/homeText';

export default function PartnerCta() {
  return (
    <section className="bg-navy py-12 text-center text-white">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-xl font-black md:text-2xl">{ht('통신 사업 제휴를 기다립니다')}</h2>
        <p className="mt-2 text-sm text-white/65">
          {ht('단말, 알뜰폰, 인터넷·IPTV 제휴 문의를 접수하고 있습니다')}
        </p>
        <Link
          href="/partnership"
          className="mt-6 inline-flex rounded-full bg-brand px-8 py-3 text-sm font-bold hover:bg-brand-dark transition-colors"
        >
          {ht('제휴 신청하기')}
        </Link>
      </div>
    </section>
  );
}
