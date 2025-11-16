import type { FomoAlertData } from '../../types';

interface FomoAlertProps {
  alerts: FomoAlertData[];
}

export default function FomoAlert({ alerts }: FomoAlertProps) {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-red-900 bg-opacity-30 border-red-700 text-red-300';
      case 'medium':
        return 'bg-yellow-900 bg-opacity-30 border-yellow-700 text-yellow-300';
      default:
        return 'bg-blue-900 bg-opacity-30 border-blue-700 text-blue-300';
    }
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'spike':
        return '급등';
      case 'trend':
        return '트렌드';
      case 'volume':
        return '거래량';
      default:
        return '알림';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🚨</span>
        <h3 className="text-lg font-semibold text-gray-900">FOMO 알림</h3>
      </div>

      {alerts.length === 0 ? (
        <div>
          <p className="text-gray-600 text-center py-4">현재 알림이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getIntensityColor(alert.intensity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getIntensityIcon(alert.intensity)}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                        {getTypeLabel(alert.type)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(alert.timestamp).toLocaleTimeString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
