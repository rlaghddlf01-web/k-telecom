import { getLang, withLang } from '@/lib/i18n';
import { ExtraDict } from '@/components/LangProvider';
import { hiddenForKorean } from '@/lib/content/koFilter';
import { primeTranslations } from '@/lib/server/prime';
import { DEFAULT_LANG, SOURCE_LANG } from '@/lib/langs';
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
import { getBanners, getEvents, getFaqsForLang, getHomeSettings, getNotices, getProducts, getSiteSettings } from '@/lib/content/load';
import { KO_HIDDEN_SECTIONS, resolveOrder } from '@/lib/content/home';
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
    getFaqsForLang(getLang()),
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
  const lang = getLang();
  const hidden = lang === DEFAULT_LANG ? [...home.hidden, ...KO_HIDDEN_SECTIONS] : home.hidden;
  // 새로 올린 휴대폰의 이름·문구는 번역 저장소에서 꺼내거나 번역해서 저장해 둔다
  const phoneExtra = await primeTranslations(phones.flatMap((p) => [p.title, p.tag, p.note, p.badge ?? '']));
  const bestTexts = Object.fromEntries(['인기 스마트폰', '전체 보기', '전체', '삼성 갤럭시', '애플 아이폰'].map((k) => [k, ht(k)]));
  const sections: Record<string, ReactNode> = {
    // 한국어 페이지(/)에서는 가린다. 다른 도구가 만든 SisterServices 는 그대로 두고 여기서만 거른다.
    sister: lang === DEFAULT_LANG || lang === SOURCE_LANG ? null : <SisterServices />,
    categories: <PopularCategories />,
    plans: <BestPlans />,
    deals: <TodayDeals phones={phones} />,
    best: (
      <ExtraDict extra={phoneExtra}>
        <BestProducts phones={phones} texts={bestTexts} />
      </ExtraDict>
    ),
    promo: <PromoBanners banners={promo} />,
    iphone: <IphoneSection phones={phones} />,
    featured: <FeaturedProducts phones={phones} />,
    showcase: <ShowcaseBanner banner={showcase[0]} />,
    brands: <BrandRow />,
    pain: <PainPoints />,
    process: <ProcessSteps />,
    news: <NewsSection items={news} />,
    support: <HomeSupport phone={settings.footer.company.phone} notices={notices} faqs={faqs.filter((f) => !hiddenForKorean(f.q, f.a))} />,
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
        {order.filter((id) => !hidden.includes(id)).map((id) => (
          <Fragment key={id}>{sections[id]}</Fragment>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}

export default withLang(HomePage);
