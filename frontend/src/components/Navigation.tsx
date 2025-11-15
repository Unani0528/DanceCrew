import React from 'react';
import { TrendingUp } from 'lucide-react';

interface NavigationProps {
  scrollY: number;
}

const Navigation: React.FC<NavigationProps> = ({ scrollY }) => {
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrollY > 50 ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-semibold tracking-tight">Insight Pulse</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">기능</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-blue-600 transition-colors">작동 방식</a>
          <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">요금제</a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;