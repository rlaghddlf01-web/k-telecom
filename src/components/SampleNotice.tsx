import { Info } from 'lucide-react';
import { SAMPLE_DATA } from '@/lib/plans';
import { t } from '@/lib/i18n';

/** 요금 데이터가 예시일 때만 보여주는 안내 */
export default function SampleNotice() {
  if (!SAMPLE_DATA) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{t('표시된 요금제와 요금은 화면 구성을 위한 예시이며 확정된 내용이 아닙니다.')}</p>
    </div>
  );
}
