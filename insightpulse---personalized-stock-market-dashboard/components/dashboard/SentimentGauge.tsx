import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SentimentGaugeProps {
  score: number;
}

const getScoreColor = (score: number) => {
  if (score < 40) return '#f87171'; // red
  if (score < 70) return '#facc15'; // yellow
  return '#4ade80'; // green
};

const SentimentGauge: React.FC<SentimentGaugeProps> = ({ score }) => {
  const color = getScoreColor(score);
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const needleAngle = -90 + (score / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center">
      <h4 className="text-lg font-bold mb-2 text-gray-900">실시간 여론 점수</h4>
      <div style={{ width: '100%', height: 160, position: 'relative' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              isAnimationActive={false}
            >
              <Cell fill={color} />
              <Cell fill="#f3f4f6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div 
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center" 
          style={{ bottom: '-10%' }}
        >
          <div className="text-center">
            <span className="text-4xl font-bold" style={{ color }}>{score}</span>
            <span className="text-gray-500"> / 100</span>
          </div>
        </div>
         <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: 'bottom center', transition: 'transform 0.5s ease-in-out' }}
        >
          <div className="w-1 h-1/2 bg-gray-700 mx-auto rounded-t-full" style={{boxShadow: '0 0 5px rgba(0,0,0,0.2)'}}></div>
          <div className="w-4 h-4 bg-gray-700 rounded-full absolute bottom-[48%] left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default SentimentGauge;