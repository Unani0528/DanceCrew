import { useState, useEffect } from 'react';

interface FearGreedData {
  value: number;
  valueText: string;
  timestamp: string;
}

export default function FearGreedIndex() {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CNN Fear & Greed Index API 호출
    // 실제 API: https://production.dataviz.cnn.io/index/fearandgreed/graphdata
    fetchFearGreedIndex();
  }, []);

  const fetchFearGreedIndex = async () => {
    try {
      const response = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata');
      const result = await response.json();
      
      if (result && result.fear_and_greed) {
        setData({
          value: result.fear_and_greed.score,
          valueText: result.fear_and_greed.rating,
          timestamp: result.fear_and_greed.timestamp,
        });
      }
    } catch (error) {
      console.error('Fear & Greed Index 로딩 실패:', error);
      // 실패 시 Mock 데이터 사용
      setData({
        value: 45,
        valueText: 'Neutral',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">공포 & 탐욕 지수</h3>
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-400">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 반원 게이지 그리기
  const radius = 80;
  const centerX = 120;
  const centerY = 120;
  const strokeWidth = 20;
  
  // 각도 계산: 왼쪽(0점) = 180도, 중앙(50점) = 270도, 오른쪽(100점) = 360도 (0도)
  // 반원은 180도부터 시작해서 시계방향으로 180도 회전
  const normalizedValue = data.value / 100; // 0 ~ 1 사이 값
  const angle = 180 + (normalizedValue * 180); // 180도 ~ 360도
  const needleLength = radius - strokeWidth / 2;
  const needleX = centerX + needleLength * Math.cos((angle * Math.PI) / 180);
  const needleY = centerY + needleLength * Math.sin((angle * Math.PI) / 180);

  // 색상 결정
  const getColor = (value: number) => {
    if (value <= 25) return '#ef4444'; // 극도의 공포 - 빨강
    if (value <= 45) return '#f97316'; // 공포 - 주황
    if (value <= 55) return '#eab308'; // 중립 - 노랑
    if (value <= 75) return '#84cc16'; // 탐욕 - 연두
    return '#22c55e'; // 극도의 탐욕 - 초록
  };

  const getLabel = (value: number) => {
    if (value <= 25) return '극도의 공포';
    if (value <= 45) return '공포';
    if (value <= 55) return '중립';
    if (value <= 75) return '탐욕';
    return '극도의 탐욕';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">공포 & 탐욕 지수</h3>
      
      <div className="flex flex-col items-center">
        <svg width="240" height="140" viewBox="0 0 240 140">
          {/* 배경 반원 (그라데이션) */}
          <defs>
            <linearGradient id="fearGreedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          
          {/* 반원 게이지 */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke="url(#fearGreedGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* 바늘 */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* 중앙 원 */}
          <circle cx={centerX} cy={centerY} r="8" fill="#1f2937" />
        </svg>

        {/* 점수 표시 */}
        <div className="mt-4 text-center">
          <div className="text-4xl font-bold" style={{ color: getColor(data.value) }}>
            {data.value}
          </div>
          <div className="text-lg font-semibold text-gray-700 mt-1">
            {getLabel(data.value)}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {new Date(data.timestamp).toLocaleDateString('ko-KR')}
          </div>
        </div>

        {/* 범례 */}
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">공포</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">중립</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">탐욕</span>
          </div>
        </div>
      </div>
    </div>
  );
}
