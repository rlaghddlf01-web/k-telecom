import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import EventBoard from '@/components/EventBoard';
import { EVENTS, WINNERS } from '@/lib/boards';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('이벤트 | K-Telecom'),
};

export default function EventsPage() {
  return (
    <PageShell path="/events" title="이벤트" lead="진행 중인 혜택과 이벤트를 확인하세요.">
      <EventBoard events={EVENTS} winners={WINNERS} />
    </PageShell>
  );
}
