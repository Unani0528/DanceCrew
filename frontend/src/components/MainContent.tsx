import { useState, useEffect } from 'react';
import type { Stock, Company } from '../types';
import { MOCK_COMPANIES } from '../constants';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import WelcomeHeader from './dashboard/WelcomeHeader';
import AiAdvisorPanel from './dashboard/AiAdvisorPanel';
import RealtimeSummaryPanel from './dashboard/RealtimeSummaryPanel';
import CorrelationChart from './CorrelationChart';
import InsightPanels from './InsightPanels';
import RawDataSample from './RawDataSample';
import FomoAlert from './dashboard/FomoAlert';
import NarrativeExtractor from './dashboard/NarrativeExtractor';
import KeyOpinionLeaders from './dashboard/KeyOpinionLeaders';
import DailyBriefing from './dashboard/DailyBriefing';
import SentimentPriceChart from './dashboard/SentimentPriceChart';

function generateMockData(company: Company): Stock {
  const score = 30 + Math.random() * 60;
  
  // 30일간의 감정-주가 데이터 생성
  const generateSentimentPriceData = () => {
    const days = 30;
    const result = [];
    const today = new Date();
    const basePrice = 50000 + Math.random() * 50000; // 기준 주가
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      
      const positive = 30 + Math.random() * 40;
      const negative = 100 - positive;
      
      // 주가는 약간의 변동성을 가지고 생성
      const priceChange = (Math.random() - 0.5) * basePrice * 0.1;
      const stockPrice = Math.round(basePrice + priceChange);
      
      result.push({
        date: dateStr,
        positive: Math.round(positive),
        negative: Math.round(negative),
        stockPrice: stockPrice,
      });
    }
    return result;
  };
  
  return {
    id: company.id,
    company,
    score,
    sentimentPriceData: generateSentimentPriceData(),
    aiSummary: {
      text: `${company.name}에 대한 투자자 심리가 ${score > 70 ? '매우 긍정적' : score > 50 ? '긍정적' : score > 40 ? '중립적' : '부정적'}입니다.`,
      timestamp: new Date().toISOString(),
    },
    realtimeSummary: {
      totalMentions: company.mentions,
      activeUsers: Math.floor(company.mentions * 0.3),
      positiveRatio: 0.3 + Math.random() * 0.4,
      avgSentiment: score,
      trendDirection: Math.random() > 0.5 ? 'up' : 'down',
    },
    keyKeywords: [
      { word: '실적발표', count: Math.floor(Math.random() * 500), sentiment: 'positive' },
      { word: '신규투자', count: Math.floor(Math.random() * 400), sentiment: 'positive' },
      { word: '주가상승', count: Math.floor(Math.random() * 350), sentiment: 'positive' },
      { word: '경쟁심화', count: Math.floor(Math.random() * 300), sentiment: 'negative' },
      { word: '규제우려', count: Math.floor(Math.random() * 250), sentiment: 'negative' },
      { word: '시장변동', count: Math.floor(Math.random() * 200), sentiment: 'negative' },
      { word: '기술혁신', count: Math.floor(Math.random() * 450), sentiment: 'core' },
      { word: '글로벌전략', count: Math.floor(Math.random() * 380), sentiment: 'core' },
      { word: '시장점유율', count: Math.floor(Math.random() * 320), sentiment: 'core' },
    ],
    chartData: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      sentiment: 30 + Math.random() * 60,
      volume: Math.floor(Math.random() * 1000),
    })),
    debates: [
      {
        id: '1',
        title: '실적 발표 후 주가 전망',
        participants: Math.floor(Math.random() * 100) + 50,
        sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
      },
      {
        id: '2',
        title: '신규 사업 투자 의견',
        participants: Math.floor(Math.random() * 80) + 40,
        sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
      },
    ],
    peerComparison: [
      { name: company.name, sentiment: score, mentions: company.mentions },
      { name: '경쟁사 A', sentiment: 40 + Math.random() * 40, mentions: Math.floor(company.mentions * 0.7) },
      { name: '경쟁사 B', sentiment: 40 + Math.random() * 40, mentions: Math.floor(company.mentions * 0.5) },
    ],
    rawComments: [
      {
        id: '1',
        author: '투자자123',
        text: '최근 실적 발표가 기대 이상이었습니다.',
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        sentiment: 'positive',
        votes: Math.floor(Math.random() * 50),
      },
      {
        id: '2',
        author: '분석가456',
        text: '장기적으로 긍정적이나 단기 조정 가능성 있음',
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        sentiment: 'neutral',
        votes: Math.floor(Math.random() * 30),
      },
    ],
    fomoAlerts: [
      {
        id: '1',
        type: 'spike',
        message: '최근 1시간 동안 언급량 급증',
        intensity: 'high',
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      },
    ],
    narratives: [
      {
        id: '1',
        theme: '기술 혁신',
        sentiment: 'positive',
        strength: 0.7 + Math.random() * 0.2,
        examples: ['신제품 출시', '특허 등록'],
      },
      {
        id: '2',
        theme: '규제 리스크',
        sentiment: 'negative',
        strength: 0.3 + Math.random() * 0.3,
        examples: ['정부 규제', '법적 분쟁'],
      },
    ],
    opinionLeaders: [
      {
        id: '1',
        username: '전문투자자A',
        influence: 0.8 + Math.random() * 0.15,
        sentiment: 'bullish',
        recentPost: '장기 투자 관점에서 매수 의견',
      },
      {
        id: '2',
        username: '애널리스트B',
        influence: 0.7 + Math.random() * 0.2,
        sentiment: 'bearish',
        recentPost: '단기 차익실현 추천',
      },
    ],
    sentimentComparison: {
      currentScore: score,
      previousScore: score + (Math.random() - 0.5) * 10,
      weekAgo: score + (Math.random() - 0.5) * 15,
      monthAgo: score + (Math.random() - 0.5) * 20,
    },
    dailyBriefing: {
      summary: `${company.name}에 대한 오늘의 투자자 심리를 요약합니다.`,
      keyPoints: [
        '실적 발표 이후 긍정적 반응 지속',
        '기관 투자자 매수세 증가',
        '기술적 분석상 상승 추세 유지',
        '글로벌 시장 불확실성은 리스크 요인',
        '장기 전망은 여전히 긍정적',
      ],
      outlook: Math.random() > 0.5 ? 'positive' : 'neutral',
    },
  };
}

export default function MainContent() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 데이터 로드
    const initialStock = generateMockData(MOCK_COMPANIES[0]);
    setSelectedStock(initialStock);
    setLoading(false);
  }, []);

  const handleCompanySelect = (company: Company) => {
    setLoading(true);
    setTimeout(() => {
      const stockData = generateMockData(company);
      setSelectedStock(stockData);
      setLoading(false);
    }, 300);
  };

  if (loading || !selectedStock) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onSelectCompany={handleCompanySelect} selectedId={selectedStock.id} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-16">
        <Header companyName={selectedStock.company.name} />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeHeader companyName={selectedStock.company.name} />
          
          <AiAdvisorPanel summary={selectedStock.aiSummary} />
          
          <RealtimeSummaryPanel 
            summary={selectedStock.realtimeSummary}
            score={selectedStock.score}
            keywords={selectedStock.keyKeywords}
          />
          
          <CorrelationChart data={selectedStock.chartData} />
          
          {selectedStock.sentimentPriceData && (
            <SentimentPriceChart 
              data={selectedStock.sentimentPriceData} 
              stockCode={selectedStock.company.ticker}
            />
          )}
          
          <InsightPanels debates={selectedStock.debates} peers={selectedStock.peerComparison} />
          
          <RawDataSample comments={selectedStock.rawComments} />
          
          <FomoAlert alerts={selectedStock.fomoAlerts} />
          
          <NarrativeExtractor narratives={selectedStock.narratives} />
          
          <KeyOpinionLeaders leaders={selectedStock.opinionLeaders} />
          
          <DailyBriefing briefing={selectedStock.dailyBriefing} />
        </main>
      </div>
    </div>
  );
}
