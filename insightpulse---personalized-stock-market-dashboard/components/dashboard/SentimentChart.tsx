
import React, { useState } from 'react';
import { PORTFOLIO_CHART_DATA, PORTFOLIO_CHART_DATA_MONTHLY } from '../../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-lg">
        <p className="label font-bold text-gray-700">{label}</p>
        <p className="text-indigo-500">{`종합 심리 점수: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SentimentChart: React.FC = () => {
    const [activeTab, setActiveTab] = useState('주간');
    const tabs = ['주간', '월간'];
    const chartData = activeTab === '주간' ? PORTFOLIO_CHART_DATA : PORTFOLIO_CHART_DATA_MONTHLY;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">나의 포트폴리오 심리 추이</h2>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
             <defs>
                <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} stroke="#D1D5DB" />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} stroke="#D1D5DB" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2.5} fill="url(#sentimentGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentChart;