import { Info } from 'lucide-react';
import { getPlans } from '@/lib/content/load';
import { t } from '@/lib/i18n';

/** 예시 요금제를 보여주는 중일 때만 보이는 안내 (관리자에서 요금제를 등록하면 사라진다) */
export default async function SampleNotice() {
  const { sample } = await getPlans();
  if (!sample) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{t('표시된 요금제와 요금은 화면 구성을 위한 예시이며 확정된 내용이 아닙니다.')}</p>
    </div>
  );
}
