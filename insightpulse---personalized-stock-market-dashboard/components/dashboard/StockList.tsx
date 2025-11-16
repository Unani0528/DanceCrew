
import React, { useState } from 'react';
import type { Stock } from '../../types';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StockListProps {
  stocks: Stock[];
}

const StockCard: React.FC<{ stock: Stock }> = ({ stock }) => {
  const isIncrease = stock.changeType === 'increase';
  const color = isIncrease ? 'text-green-500' : 'text-red-500';
  const chartColor = isIncrease ? '#10B981' : '#EF4444';

  return (
    <div className="grid grid-cols-6 gap-4 items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="col-span-2 flex items-center">
        <stock.logo className="w-10 h-10 mr-4" />
        <div>
          <p className="font-bold text-gray-800">{stock.name}</p>
          <p className="text-sm text-gray-500">{stock.ticker}</p>
        </div>
      </div>
      <div className="col-span-1 h-12">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stock.sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id={`color-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill={`url(#color-${stock.id})`} />
            </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="col-span-1 text-right">
        <p className="font-semibold text-gray-800">{stock.price.toLocaleString()}원</p>
      </div>
      <div className="col-span-1 text-right">
        <p className={`font-semibold ${color}`}>{isIncrease ? '+' : ''}{stock.change.toLocaleString()} ({stock.changePercent.toFixed(2)}%)</p>
      </div>
      <div className="col-span-1 text-right">
        <button className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm">
          상세 분석
        </button>
      </div>
    </div>
  );
};

const StockList: React.FC<StockListProps> = ({ stocks }) => {
  const [activeTab, setActiveTab] = useState('인기');
  const tabs = ['가장 인기있는', '상승률 Top', '하락률 Top'];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">KOSPI 실시간 관심 종목</h2>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        {stocks.map((stock) => (
          <StockCard key={stock.id} stock={stock} />
        ))}
      </div>
    </div>
  );
};

export default StockList;