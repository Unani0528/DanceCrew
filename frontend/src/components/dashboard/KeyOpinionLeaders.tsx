import type { OpinionLeader } from '../../types';

interface KeyOpinionLeadersProps {
  leaders: OpinionLeader[];
}

export default function KeyOpinionLeaders({ leaders }: KeyOpinionLeadersProps) {
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <span className="px-2 py-1 bg-green-900 bg-opacity-30 text-green-400 text-xs rounded">매수 의견</span>;
      case 'bearish':
        return <span className="px-2 py-1 bg-red-900 bg-opacity-30 text-red-400 text-xs rounded">매도 의견</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">중립 의견</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👥</span>
        <h3 className="text-lg font-semibold text-gray-900">여론 주도자 의견</h3>
      </div>

      <div className="space-y-4">
        {leaders.map((leader) => (
          <div
            key={leader.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{leader.username}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs text-gray-600">
                    영향력: {(leader.influence * 100).toFixed(0)}%
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${leader.influence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              {getSentimentBadge(leader.sentiment)}
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">
              {leader.recentPost}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
