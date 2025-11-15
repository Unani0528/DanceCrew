import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import './styles/animations.css';

const InsightPulse: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation scrollY={scrollY} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default InsightPulse;