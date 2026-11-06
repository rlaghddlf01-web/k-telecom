import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import EventBoard from '@/components/EventBoard';
import { WINNERS } from '@/lib/boards';
import { getEvents } from '@/lib/content/load';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('이벤트 | K-Telecom'),
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <PageShell path="/events" managed title="이벤트" lead="진행 중인 혜택과 이벤트를 확인하세요.">
      <EventBoard events={events} winners={WINNERS} />
    </PageShell>
  );
}
