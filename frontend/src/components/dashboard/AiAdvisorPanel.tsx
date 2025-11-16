import type { AiSummary } from '../../types';

interface AiAdvisorPanelProps {
  summary: AiSummary;
}

export default function AiAdvisorPanel({ summary }: AiAdvisorPanelProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI 어드바이저</h3>
          <p className="text-sm text-gray-600">실시간 시장 분석</p>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-gray-900 leading-relaxed">{summary.text}</p>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
          분석 시간: {new Date(summary.timestamp).toLocaleString('ko-KR')}
      </div>
    </div>
  );
}
