import { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SentimentPriceChartProps {
  data: Array<{
    date: string;
    positive: number;
    negative: number;
    stockPrice: number;
  }>;
  stockCode?: string; // 종목 코드 (예: 005930 for 삼성전자)
}

export default function SentimentPriceChart({ data, stockCode = '005930' }: SentimentPriceChartProps) {
  const [chartData, setChartData] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 실제 주가 데이터 가져오기
    fetchRealStockPrice();
  }, [stockCode]);

  const fetchRealStockPrice = async () => {
    setLoading(true);
    try {
      // 네이버 금융 API를 통한 실제 주가 데이터 호출
      // CORS 문제로 인해 프록시 서버 필요 - 여기서는 백엔드 API 사용
      const response = await fetch(`/api/stock-price/${stockCode}?days=30`);
      
      if (response.ok) {
        const realPriceData = await response.json();
        
        // 감정 데이터와 실제 주가 데이터 병합
        const mergedData = data.map((item, index) => {
          const realPrice = realPriceData[index];
          return {
            ...item,
            stockPrice: realPrice ? realPrice.close : item.stockPrice,
          };
        });
        
        setChartData(mergedData);
      } else {
        // API 실패 시 Mock 데이터 사용
        console.warn('실제 주가 데이터 로딩 실패, Mock 데이터 사용');
        setChartData(data);
      }
    } catch (error) {
      console.error('주가 데이터 로딩 에러:', error);
      // 에러 시에도 원본 데이터 사용
      setChartData(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">감정 추이 vs 주가 (30일)</h3>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">주가 데이터 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">감정 추이 vs 주가 (30일)</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-700">긍정</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-700">부정</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-700">실제 주가</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6b7280" 
            domain={[0, 100]}
            label={{ value: '감정 점수', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            label={{ value: '주가 (원)', angle: 90, position: 'insideRight', style: { fill: '#10b981' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              color: '#1f2937',
            }}
            formatter={(value: number, name: string) => {
              if (name === '주가') {
                return [value.toLocaleString() + '원', name];
              }
              return [value.toFixed(1) + '%', name];
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '24px',
              fontSize: '18px',
              fontWeight: '600'
            }}
            iconSize={28}
            iconType="square"
          />
          
          {/* 막대그래프: 긍정/부정 감정 */}
          <Bar 
            yAxisId="left"
            dataKey="positive" 
            stackId="sentiment"
            fill="#3b82f6" 
            name="긍정"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="left"
            dataKey="negative" 
            stackId="sentiment"
            fill="#ef4444" 
            name="부정"
            radius={[4, 4, 0, 0]}
          />
          
          {/* 선 그래프: 주가 */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="stockPrice"
            stroke="#10b981"
            strokeWidth={3}
            name="주가"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          💡 <span className="font-medium">인사이트:</span> 막대그래프는 긍정/부정 감정 비율을, 녹색 선은 실제 주가를 나타냅니다. 
          감정이 주가에 선행하는지 후행하는지 패턴을 확인해보세요.
        </p>
      </div>
    </div>
  );
}
