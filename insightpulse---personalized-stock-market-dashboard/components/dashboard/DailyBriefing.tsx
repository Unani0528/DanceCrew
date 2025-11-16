
import React from 'react';
import type { DailyBriefingData } from '../../types';

const AiIcon = () => (
    <svg className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const DailyBriefing: React.FC<{ data: DailyBriefingData }> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-full flex flex-col">
      <div className="flex items-center mb-3">
        <AiIcon />
        <h4 className="text-lg font-bold text-gray-900">AI 데일리 심리 브리핑 (어제자 요약)</h4>
      </div>
      <div className="flex-grow flex items-center">
        <p className="text-sm text-gray-700 leading-relaxed">
            {data.summary}
        </p>
      </div>
    </div>
  );
};

export default DailyBriefing;
