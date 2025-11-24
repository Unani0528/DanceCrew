import React, { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/stock/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>투자 인사이트의 새로운 기준</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          시장의 감정을<br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            읽어내는 AI
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          수백만 개의 투자자 댓글을 실시간으로 분석하여<br />
          시장의 진짜 심리를 파악하고 더 나은 투자 결정을 내리세요
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="종목명 또는 종목코드를 입력하세요 (예: 삼성전자, 005930)"
              className="w-full pl-16 pr-6 py-5 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all shadow-lg hover:shadow-xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all hover:scale-105"
            >
              분석하기
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            💡 인기 종목: 삼성전자, 카카오, NAVER, 현대차, SK하이닉스
          </p>
        </form>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-60 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </section>
  );
};

export default HeroSection;