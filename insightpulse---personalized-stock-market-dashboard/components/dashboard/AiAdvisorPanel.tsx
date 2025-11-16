import React from 'react';

interface AiAdvisorPanelProps {
  summary: string;
  confidence: number;
}

const AiIcon = () => (
  <svg className="w-6 h-6 mr-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);


const AiAdvisorPanel: React.FC<AiAdvisorPanelProps> = ({ summary, confidence }) => {
  return (
    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 flex items-center shadow-sm">
      <AiIcon />
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-blue-700">AI 어드바이저</h4>
            <div className="text-xs text-gray-500">신뢰도: <span className="font-bold text-gray-700">{confidence}%</span></div>
        </div>
        <p className="text-blue-900 text-base font-medium">{summary}</p>
        <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-gray-500">이 분석이 유용한가요?</span>
            <div className="flex gap-2">
                <button className="text-lg text-gray-400 hover:text-gray-800 transition-colors hover:scale-110" aria-label="Useful">👍</button>
                <button className="text-lg text-gray-400 hover:text-gray-800 transition-colors hover:scale-110" aria-label="Not useful">👎</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiAdvisorPanel;