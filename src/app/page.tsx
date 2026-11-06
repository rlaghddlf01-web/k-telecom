import SiteHeader from '@/components/SiteHeader';
import PromoStrip from '@/components/PromoStrip';
import PopupBanner from '@/components/PopupBanner';
import HeroSlider from '@/components/HeroSlider';
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
import { getBanners, getProducts, getSiteSettings } from '@/lib/content/load';

export default async function HomePage() {
  const [strip, hero, promo, showcase, popup, phones, settings] = await Promise.all([
    getBanners('top_strip'),
    getBanners('hero'),
    getBanners('promo'),
    getBanners('showcase'),
    getBanners('popup'),
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PromoStrip banner={strip[0]} />
      <SiteHeader />
      <PopupBanner banner={popup[0]} />
      <main>
        <HeroSlider slides={hero} />
        <PopularCategories />
        <BestPlans />
        <TodayDeals phones={phones} />
        <BestProducts phones={phones} />
        <PromoBanners banners={promo} />
        <IphoneSection phones={phones} />
        <FeaturedProducts phones={phones} />
        <ShowcaseBanner banner={showcase[0]} />
        <BrandRow />
        <PainPoints />
        <ProcessSteps />
        <NewsSection />
        <HomeSupport phone={settings.footer.company.phone} />
        <FeatureStrip />
        <PartnerCta />
      </main>
      <SiteFooter />
    </>
  );
}
