import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
  Bar,
} from 'recharts';
import type { ChartDataPoint } from '../types';

interface CorrelationChartProps {
  companyName: string;
  chartData: {
    '1D': ChartDataPoint[];
    '5D': ChartDataPoint[];
    '1M': ChartDataPoint[];
  };
}

type TimeFrame = '1D' | '5D' | '1M';
const timeFrameKorean: Record<TimeFrame, string> = { '1D': '1일', '5D': '5일', '1M': '1개월' };

// FIX: Updated tooltip to correctly display separate positive and negative sentiment values from the data.
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const priceData = payload.find((p: any) => p.dataKey === 'price');
    const positiveData = payload.find((p: any) => p.dataKey === 'positive');
    const negativeData = payload.find((p: any) => p.dataKey === 'negative');

    return (
      <div className="bg-slate-800 border border-slate-600 p-4 rounded-lg shadow-lg">
        <p className="label font-bold text-slate-100">{`${label}`}</p>
        {priceData && <p className="text-blue-400">{`주가: ${priceData.value.toLocaleString()}원`}</p>}
        {positiveData && positiveData.value > 0 && <p className="text-green-400">{`긍정 여론: ${positiveData.value}`}</p>}
        {negativeData && negativeData.value > 0 && <p className="text-red-400">{`부정 여론: ${negativeData.value}`}</p>}
      </div>
    );
  }
  return null;
};


const CorrelationChart: React.FC<CorrelationChartProps> = ({ companyName, chartData }) => {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('1D');
    const data = chartData[timeFrame];
  
    return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-100">{companyName} 주가-여론 상관관계 분석</h3>
        <div className="flex space-x-1 bg-slate-700 p-1 rounded-md">
          {(['1D', '5D', '1M'] as TimeFrame[]).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                timeFrame === frame ? 'bg-cyan-500 text-white' : 'text-slate-300 hover:bg-slate-600'
              }`}
            >
              {timeFrameKorean[frame]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis yAxisId="left" label={{ value: '주가 (KRW)', angle: -90, position: 'insideLeft', fill: '#60a5fa' }} stroke="#60a5fa" tickFormatter={(value) => value.toLocaleString()} />
            <YAxis yAxisId="right" orientation="right" label={{ value: '여론 발생량', angle: 90, position: 'insideRight', fill: '#94a3b8' }} stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                name="주가"
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 8 }}
            />
            {/* FIX: Replaced the single bar using a non-existent 'sentiment' property with two stacked bars for 'positive' and 'negative'. This fixes the type error and correctly visualizes the data. */}
            <Bar yAxisId="right" dataKey="positive" stackId="sentiment" name="긍정 여론" fill="rgba(74, 222, 128, 0.6)" />
            <Bar yAxisId="right" dataKey="negative" stackId="sentiment" name="부정 여론" fill="rgba(248, 113, 113, 0.6)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CorrelationChart;