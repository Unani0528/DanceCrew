import type { RealtimeSummary, KeyKeyword } from '../../types';
import SentimentGauge from './SentimentGauge';

interface RealtimeSummaryPanelProps {
  summary: RealtimeSummary;
  score: number;
  keywords: KeyKeyword[];
}

export default function RealtimeSummaryPanel({ summary, score, keywords }: RealtimeSummaryPanelProps) {
  const positiveKeywords = keywords.filter(k => k.sentiment === 'positive');
  const negativeKeywords = keywords.filter(k => k.sentiment === 'negative');
  const coreKeywords = keywords.filter(k => k.sentiment === 'core');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 실시간 여론 점수 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">실시간 여론 점수</h3>
        
        <SentimentGauge score={score} />
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{summary.totalMentions.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">총 언급</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{summary.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">활성 사용자</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {(summary.positiveRatio * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">긍정 비율</div>
          </div>
        </div>
      </div>

      {/* 핵심 키워드 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">핵심 키워드</h3>
        
        <div className="space-y-4">
          {/* 긍정 키워드 */}
          <div>
            <div className="text-sm font-medium text-green-400 mb-2">긍정 키워드</div>
            <div className="flex flex-wrap gap-2">
              {positiveKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-900 bg-opacity-30 border border-green-700 rounded-full text-sm text-green-300"
                >
                  {kw.word} ({kw.count})
                </span>
              ))}
            </div>
          </div>

          {/* 부정 키워드 */}
          <div>
            <div className="text-sm font-medium text-red-400 mb-2">부정 키워드</div>
            <div className="flex flex-wrap gap-2">
              {negativeKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-900 bg-opacity-30 border border-red-700 rounded-full text-sm text-red-300"
                >
                  {kw.word} ({kw.count})
                </span>
              ))}
            </div>
          </div>

          {/* 핵심 키워드 */}
          <div>
            <div className="text-sm font-medium text-blue-400 mb-2">핵심 키워드</div>
            <div className="flex flex-wrap gap-2">
              {coreKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-full text-sm text-blue-300"
                >
                  {kw.word} ({kw.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
