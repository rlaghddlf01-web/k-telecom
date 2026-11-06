import SiteHeaderView from '@/components/SiteHeaderView';
import { getSiteSettings } from '@/lib/content/load';

/** 헤더: 내용은 관리자의 [헤더·푸터]에서 수정 */
export default async function SiteHeader() {
  const { header } = await getSiteSettings();
  return <SiteHeaderView header={header} />;
}
