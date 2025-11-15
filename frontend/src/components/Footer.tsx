import React from 'react';
import { TrendingUp } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <span className="text-white text-lg font-semibold">Insight Pulse</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">고객지원</a>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          © 2024 Insight Pulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;