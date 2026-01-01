import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { CustomSizingPromo } from '@/components/home/CustomSizingPromo';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BestSellersSection />
      <CustomSizingPromo />
    </Layout>
  );
};

export default Index;
