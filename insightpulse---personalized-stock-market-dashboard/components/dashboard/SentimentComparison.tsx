
import React from 'react';
import type { SentimentComparisonData } from '../../types';

const Gauge = ({ label, value, score }: { label: string; value: string; score: number }) => {
  const scoreColor = score > 70 ? 'bg-blue-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="text-center p-4 rounded-lg bg-gray-50">
      <h5 className="text-sm font-semibold text-gray-500 mb-2">{label}</h5>
      <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
        <div className={`${scoreColor} h-6 rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
};

const SentimentComparison: React.FC<{ data: SentimentComparisonData }> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h4 className="text-lg font-bold text-gray-900 mb-4">기관의 시선 vs. 개인의 목소리</h4>
      <div className="grid grid-cols-2 gap-4">
        <Gauge label="기관의 시선" value={data.analystSentiment} score={data.analystScore} />
        <Gauge label="개인의 목소리" value={data.retailSentiment} score={data.retailScore} />
      </div>
      <p className="text-center text-sm text-gray-600 mt-4 p-3 bg-gray-100 rounded-md">
        {data.gapDescription}
      </p>
    </div>
  );
};

export default SentimentComparison;
