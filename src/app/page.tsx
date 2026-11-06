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

export default function HomePage() {
  return (
    <>
      <PromoStrip />
      <SiteHeader />
      <PopupBanner />
      <main>
        <HeroSlider />
        <PopularCategories />
        <BestPlans />
        <TodayDeals />
        <BestProducts />
        <PromoBanners />
        <IphoneSection />
        <FeaturedProducts />
        <ShowcaseBanner />
        <BrandRow />
        <PainPoints />
        <ProcessSteps />
        <NewsSection />
        <HomeSupport />
        <FeatureStrip />
        <PartnerCta />
      </main>
      <SiteFooter />
    </>
  );
}
