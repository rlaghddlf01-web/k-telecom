import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/pageMeta';
import EventBoard from '@/components/EventBoard';
import { WINNERS } from '@/lib/boards';
import { getEvents } from '@/lib/content/load';
import { t, withLang } from '@/lib/i18n';

export const generateMetadata = pageMeta('이벤트 | K-Telecom');

async function EventsPage() {
  const events = await getEvents();

  return (
    <PageShell path="/events" managed title="이벤트" lead="진행 중인 혜택과 이벤트를 확인하세요.">
      <EventBoard events={events} winners={WINNERS} />
    </PageShell>
  );
}

export default withLang(EventsPage);
