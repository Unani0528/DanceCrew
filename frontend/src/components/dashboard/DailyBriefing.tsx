import type { DailyBriefingData } from '../../types';

interface DailyBriefingProps {
  briefing: DailyBriefingData;
}

export default function DailyBriefing({ briefing }: DailyBriefingProps) {
  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getOutlookIcon = (outlook: string) => {
    switch (outlook) {
      case 'positive':
        return (
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'negative':
        return (
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">오늘의 브리핑</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-gray-200 leading-relaxed">{briefing.summary}</p>
      </div>

      <div className="space-y-2 mb-4">
        {briefing.keyPoints.map((point, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-900 bg-opacity-30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-blue-400 font-medium">{idx + 1}</span>
            </div>
            <p className="text-gray-700 text-sm">{point}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
        {getOutlookIcon(briefing.outlook)}
        <div>
          <div className="text-sm text-gray-600">종합 전망</div>
          <div className={`font-medium ${getOutlookColor(briefing.outlook)}`}>
            {briefing.outlook === 'positive' ? '긍정적' : briefing.outlook === 'negative' ? '부정적' : '중립'}
          </div>
        </div>
      </div>
    </div>
  );
}
