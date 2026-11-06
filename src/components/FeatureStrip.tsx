import { Truck, Languages, ScanLine, Wrench } from 'lucide-react';
import { ht } from '@/lib/content/homeText';

const ITEMS = [
  { icon: Truck, title: '무료 배송', desc: '단말·유심 우체국 택배 발송' },
  { icon: Languages, title: '모국어 안내', desc: '요금제와 월 납부액을 내 나라 말로' },
  { icon: ScanLine, title: '30초 비대면 접수', desc: '신분증 OCR과 전자서명' },
  { icon: Wrench, title: '방문 설치', desc: '인터넷은 전문 기사님이 설치' },
];

export default function FeatureStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold">{ht(title)}</p>
              <p className="text-xs text-slate-500">{ht(desc)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
