import React from 'react';
import type { RawComment, ChartDataPoint } from '../../types';

interface RawDataSampleProps {
  rawComments: RawComment[];
  hoveredDataPoint: ChartDataPoint | null;
  activeFilter: string | null;
}

const PositiveIcon = () => <span className="text-green-500 text-lg mr-3">👍</span>;
const NegativeIcon = () => <span className="text-red-500 text-lg mr-3">👎</span>;

const HighlightedText = ({ text, keywords }: { text: string; keywords?: string[] }) => {
  if (!keywords || keywords.length === 0) {
    return <>{text}</>;
  }
  const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        keywords.some(kw => part.toLowerCase() === kw.toLowerCase()) ? (
          <strong key={index} className="text-blue-600 font-bold bg-blue-100 px-1 rounded">{part}</strong>
        ) : (
          part
        )
      )}
    </span>
  );
};

const RawDataSample: React.FC<RawDataSampleProps> = ({ rawComments, hoveredDataPoint, activeFilter }) => {
  // This is a simple simulation to link chart hover to a comment.
  // In a real app, comments would have timestamps to match against.
  let highlightedCommentId: number | null = null;
  if (hoveredDataPoint) {
    if (hoveredDataPoint.positive > hoveredDataPoint.negative * 1.5) {
      highlightedCommentId = rawComments.find(c => c.sentiment === 'positive')?.id ?? null;
    } else if (hoveredDataPoint.negative > hoveredDataPoint.positive * 1.5) {
      highlightedCommentId = rawComments.find(c => c.sentiment === 'negative')?.id ?? null;
    }
  }

  const filteredComments = activeFilter
    ? rawComments.filter(comment => {
        // Simple filter logic: check if comment text includes keywords from the topic
        const keywords = activeFilter.split(' ').filter(word => word.length > 1);
        return keywords.some(kw => comment.text.includes(kw));
      })
    : rawComments;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h4 className="text-lg font-bold mb-4 text-gray-900">실시간 토론 샘플</h4>
      <div className="max-h-60 overflow-y-auto pr-4 space-y-4">
        {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <div 
                key={comment.id} 
                className={`flex items-start p-3 rounded-md transition-all duration-300 ${
                  comment.id === highlightedCommentId 
                    ? 'bg-blue-100 ring-2 ring-blue-400' 
                    : 'bg-gray-50'
                }`}
              >
                {comment.sentiment === 'positive' ? <PositiveIcon /> : <NegativeIcon />}
                <p className="text-sm text-gray-700">
                  <HighlightedText text={comment.text} keywords={comment.reasonKeywords} />
                </p>
              </div>
            ))
        ) : (
            <div className="text-center py-8">
                <p className="text-gray-500">선택된 토픽과 관련된 댓글이 없습니다.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RawDataSample;