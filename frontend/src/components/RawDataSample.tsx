import type { RawComment } from '../types';

interface RawDataSampleProps {
  comments: RawComment[];
}

export default function RawDataSample({ comments }: RawDataSampleProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-900 bg-opacity-20';
      case 'negative': return 'text-red-400 bg-red-900 bg-opacity-20';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '긍정';
      case 'negative': return '부정';
      default: return '중립';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">실시간 댓글</h3>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-xs">
                    {comment.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{comment.author}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(comment.timestamp).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded text-xs ${getSentimentColor(comment.sentiment)}`}>
                {getSentimentLabel(comment.sentiment)}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-3">{comment.text}</p>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{comment.votes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
