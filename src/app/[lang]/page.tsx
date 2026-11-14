import { withLang } from '@/lib/i18n';
import SiteHeader from '@/components/SiteHeader';
import PromoStrip from '@/components/PromoStrip';
import PopupBanner from '@/components/PopupBanner';
import HeroSlider from '@/components/HeroSlider';
import SisterServices from '@/components/SisterServices';
import PopularCategories from '@/components/PopularCategories';
import BestPlans from '@/components/BestPlans';
import TodayDeals from '@/components/TodayDeals';
import BestProducts from '@/components/BestProducts';
import PromoBanners from '@/components/PromoBanners';
import IphoneSection from '@/components/IphoneSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ShowcaseBanner from '@/components/ShowcaseBanner';
import BrandRow from '@/components/BrandRow';
import PainPoints from '@/components/PainPoints';
import ProcessSteps from '@/components/ProcessSteps';
import NewsSection from '@/components/NewsSection';
import HomeSupport from '@/components/HomeSupport';
import FeatureStrip from '@/components/FeatureStrip';
import PartnerCta from '@/components/PartnerCta';
import SiteFooter from '@/components/SiteFooter';
import type { NewsItem } from '@/components/NewsSection';
import { Fragment, type ReactNode } from 'react';
import { getBanners, getEvents, getFaqs, getHomeSettings, getNotices, getProducts, getSiteSettings } from '@/lib/content/load';
import { resolveOrder } from '@/lib/content/home';
import { ht, setHomeTexts } from '@/lib/content/homeText';

async function HomePage() {
  const [strip, hero, promo, showcase, popup, phones, settings, notices, events, faqs, home] = await Promise.all([
    getBanners('top_strip'),
    getBanners('hero'),
    getBanners('promo'),
    getBanners('showcase'),
    getBanners('popup'),
    getProducts(),
    getSiteSettings(),
    getNotices(),
    getEvents(),
    getFaqs(),
    getHomeSettings(),
  ]);

  // 최신 소식: 공지와 이벤트를 합쳐 게시일이 최신인 4개
  const news: NewsItem[] = [
    ...notices.map((p) => ({ post: p, href: `/support/notice/${p.id}` })),
    ...events.map((p) => ({ post: p, href: `/events/${p.id}` })),
  ]
    .sort((a, b) => b.post.date.localeCompare(a.post.date))
    .slice(0, 4)
    .map(({ post, href }) => ({
      id: `${href}`,
      title: post.title,
      desc: (post.body[0] ?? '').slice(0, 80),
      date: post.date,
      href,
    }));

  // 관리자가 정한 순서·노출·문구로 구역을 그린다
  setHomeTexts(home.texts);
  const order = resolveOrder(home);
  const bestTexts = Object.fromEntries(['인기 스마트폰', '전체 보기', '전체', '삼성 갤럭시', '애플 아이폰'].map((k) => [k, ht(k)]));
  const sections: Record<string, ReactNode> = {
    sister: <SisterServices />,
    categories: <PopularCategories />,
    plans: <BestPlans />,
    deals: <TodayDeals phones={phones} />,
    best: <BestProducts phones={phones} texts={bestTexts} />,
    promo: <PromoBanners banners={promo} />,
    iphone: <IphoneSection phones={phones} />,
    featured: <FeaturedProducts phones={phones} />,
    showcase: <ShowcaseBanner banner={showcase[0]} />,
    brands: <BrandRow />,
    pain: <PainPoints />,
    process: <ProcessSteps />,
    news: <NewsSection items={news} />,
    support: <HomeSupport phone={settings.footer.company.phone} notices={notices} faqs={faqs} />,
    features: <FeatureStrip />,
    partner: <PartnerCta />,
  };

  return (
    <>
      <PromoStrip banner={strip[0]} />
      <SiteHeader />
      <PopupBanner banner={popup[0]} />
      <main>
        <HeroSlider slides={hero} />
        {order.filter((id) => !home.hidden.includes(id)).map((id) => (
          <Fragment key={id}>{sections[id]}</Fragment>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}

export default withLang(HomePage);
