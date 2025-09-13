import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import ComplaintForm from '@/components/ComplaintForm';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ecosathi-gradient overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <ComplaintForm />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}