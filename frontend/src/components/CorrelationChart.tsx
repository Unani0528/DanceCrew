import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '../types';

interface CorrelationChartProps {
  data: ChartDataPoint[];
}

export default function CorrelationChart({ data }: CorrelationChartProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">시간별 감정 추이 (24시간)</h3>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" stroke="#6b7280" domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: '#1f2937',
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sentiment"
            stroke="#3b82f6"
            strokeWidth={3}
            name="감정 점수"
            dot={{ fill: '#3b82f6', r: 3 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            stroke="#10b981"
            strokeWidth={2}
            name="거래량"
            dot={{ fill: '#10b981', r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
