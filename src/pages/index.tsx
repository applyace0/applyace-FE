import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import Navigation from '@/components/homepage/Navigation';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';
import PricingSection from '@/components/homepage/PricingSection';
import Footer from '@/components/homepage/Footer';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const handleAuthClick = () => navigate('/auth');

  // Auto-scroll to pricing section when navigating to /pricing
  useEffect(() => {
    if (location.pathname === '/pricing') {
      // Small delay to ensure the page is fully rendered
      const timer = setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading ApplyAce...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navigation onAuthClick={handleAuthClick} />
      <main className="flex-1">
        <HeroSection onGetStartedClick={handleAuthClick} />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
} 