import React from 'react';
import type { Company } from '../types';

interface SidebarProps {
  hotStocks: Company[];
  selectedCompany: Company;
  onSelectCompany: (company: Company) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ hotStocks, selectedCompany, onSelectCompany }) => {
  return (
    <aside className="w-1/4 bg-white border-r border-gray-200 p-6 flex-shrink-0">
      <h2 className="text-lg font-bold text-gray-900 mb-4">KOSPI 실시간 관심 종목</h2>
      <ul className="space-y-2">
        {hotStocks.map((stock, index) => (
          <li
            key={stock.id}
            onClick={() => onSelectCompany(stock)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedCompany.id === stock.id
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
            role="button"
            aria-pressed={selectedCompany.id === stock.id}
            tabIndex={0}
          >
            <span className={`text-sm font-bold w-8 ${selectedCompany.id === stock.id ? 'text-blue-600' : 'text-gray-400'}`}>
              {index + 1}.
            </span>
            <div className="flex-grow">
              <p className="font-semibold text-gray-800">{stock.name} ({stock.ticker})</p>
              <p className="text-xs text-gray-500">토론량: {stock.mentions.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;