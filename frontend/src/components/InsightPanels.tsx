import FearGreedIndex from './dashboard/FearGreedIndex';

interface InsightPanelsProps {
  data: any;
}

export default function InsightPanels({ data }: InsightPanelsProps) {
  const debates = [
    { id: 1, title: '강세', participants: 1234, trend: 'up' },
    { id: 2, title: '약세', participants: 890, trend: 'down' },
    { id: 3, title: '중립', participants: 456, trend: 'neutral' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 주요 논쟁 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 논쟁</h3>
        <div className="space-y-3">
          {debates.map((debate) => (
            <div
              key={debate.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div>
                <div className="font-medium text-gray-900">{debate.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  <span>{debate.participants}명 참여</span>
                </div>
              </div>
              <div className={`text-sm font-semibold ${
                debate.trend === 'up' ? 'text-red-500' : 
                debate.trend === 'down' ? 'text-blue-500' : 
                'text-gray-500'
              }`}>
                {debate.trend === 'up' ? '↑' : debate.trend === 'down' ? '↓' : '→'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 공포 & 탐욕 지수 */}
      <FearGreedIndex />
    </div>
  );
}
