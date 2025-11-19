import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SentimentGaugeProps {
  score: number;
}

export default function SentimentGauge({ score }: SentimentGaugeProps) {
  const data = [
    { value: score },
    { value: 100 - score }
  ];

  const getColor = (score: number) => {
    if (score < 40) return '#ef4444'; // red
    if (score < 70) return '#fbbf24'; // yellow
    return '#10b981'; // green
  };

  const color = getColor(score);
  // 바늘 각도: 왼쪽(0점) = -90도, 중앙(50점) = 0도, 오른쪽(100점) = 90도
  const angle = -90 + (score / 100) * 180;

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Needle */}
      <div
        className="absolute left-1/2 origin-bottom transition-transform duration-500"
        style={{
          bottom: '30%',
          transform: `translateX(-50%) rotate(${angle}deg)`,
          width: '3px',
          height: '70px',
        }}
      >
        <div className="w-full h-full bg-gray-100 rounded-full shadow-lg" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-100 rounded-full border-2 border-white" />
      </div>

      {/* Score */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-3xl font-bold" style={{ color }}>
          {score.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500">/ 100</div>
      </div>
    </div>
  );
}
