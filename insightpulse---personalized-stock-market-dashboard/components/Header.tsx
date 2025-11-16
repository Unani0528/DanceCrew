import React from 'react';

const LogoIcon: React.FC = () => (
  <svg
    className="w-8 h-8 mr-3 text-cyan-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SearchIcon: React.FC = () => (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <LogoIcon />
        <h1 className="text-xl font-bold text-slate-100">InsightPulse</h1>
      </div>
      <div className="w-1/3 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
        </div>
        <input
          type="search"
          placeholder="종목명 또는 코드를 검색하세요..."
          className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 pl-10 pr-4 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
    </header>
  );
};

export default Header;
