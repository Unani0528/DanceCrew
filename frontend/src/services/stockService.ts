import type { Stock, Company } from '../types';
import * as api from './api';

// 백엔드 연동 여부 플래그 (개발 중에는 false, 백엔드 준비되면 true)
const USE_BACKEND = false;

// Mock 데이터 생성 함수
function generateMockStock(company: Company): Stock {
  const score = 30 + Math.random() * 60;
  
  // 30일간의 감정-주가 데이터 생성
  const generateSentimentPriceData = () => {
    const days = 30;
    const result = [];
    const today = new Date();
    const basePrice = 50000 + Math.random() * 50000;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      
      const positive = 30 + Math.random() * 40;
      const negative = 100 - positive;
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
      { id: '1', title: '급등 예상', participants: Math.floor(Math.random() * 500), sentiment: 'bullish' },
      { id: '2', title: '단기 조정 우려', participants: Math.floor(Math.random() * 300), sentiment: 'bearish' },
    ],
    peerComparison: [
      { name: '경쟁사 A', value: Math.random() * 100 },
      { name: '경쟁사 B', value: Math.random() * 100 },
    ],
    rawComments: Array.from({ length: 5 }, (_, i) => ({
      id: `comment-${i}`,
      author: `사용자${i + 1}`,
      text: `이 종목에 대한 의견 ${i + 1}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
      likes: Math.floor(Math.random() * 50),
    })),
    fomoAlerts: [
      {
        id: 'fomo-1',
        type: 'surge',
        title: '급등 알림',
        message: '최근 1시간 동안 언급량 급증',
        timestamp: new Date().toISOString(),
        severity: 'high',
      },
    ],
    narratives: [
      { 
        id: 'n1', 
        theme: '신기술 개발 성공', 
        sentiment: 'positive', 
        strength: 0.85,
        examples: ['AI 기술 특허 출원', '차세대 반도체 개발', '글로벌 파트너십 체결']
      },
      { 
        id: 'n2', 
        theme: '시장 경쟁 심화', 
        sentiment: 'negative', 
        strength: 0.60,
        examples: ['중국 업체 점유율 확대', '가격 경쟁 격화', '마진율 하락 우려']
      },
      { 
        id: 'n3', 
        theme: '실적 개선 기대', 
        sentiment: 'positive', 
        strength: 0.72,
        examples: ['분기 매출 증가', '영업이익 개선', '신규 수주 확대']
      },
    ],
    opinionLeaders: [
      { 
        id: 'ol1', 
        username: '투자고수', 
        influence: 0.90, 
        sentiment: 'bullish',
        recentPost: '삼성전자 실적 발표 후 주가 상승 전망. AI 반도체 수요 증가로 장기 성장 기대됩니다.'
      },
      { 
        id: 'ol2', 
        username: '시장분석가', 
        influence: 0.75, 
        sentiment: 'neutral',
        recentPost: '단기적으로는 조정 가능성이 있으나, 중장기 펀더멘털은 견조합니다.'
      },
      { 
        id: 'ol3', 
        username: '테크인사이더', 
        influence: 0.82, 
        sentiment: 'bullish',
        recentPost: '신규 팹 가동으로 생산능력 확대. 메모리 반도체 업황 회복 시그널입니다.'
      },
    ],
    sentimentComparison: {
      current: score,
      previous: score - 5 + Math.random() * 10,
      change: Math.random() * 10 - 5,
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

// 통합 데이터 가져오기 함수
export async function getStockData(company: Company): Promise<Stock> {
  if (!USE_BACKEND) {
    // Mock 데이터 사용
    return Promise.resolve(generateMockStock(company));
  }

  try {
    // 백엔드 API 병렬 호출
    const [
      sentiment,
      sentimentTrend,
      stockPrice,
      aiSummary,
      keywords,
      narratives,
      fomoAlerts,
      opinionLeaders,
      comments,
      briefing,
      hourlySentiment,
    ] = await Promise.all([
      api.fetchRealtimeSentiment(company.ticker),
      api.fetchSentimentTrend(company.ticker, 30),
      api.fetchStockPrice(company.ticker, 30),
      api.fetchAISummary(company.ticker),
      api.fetchKeywords(company.ticker),
      api.fetchNarratives(company.ticker),
      api.fetchFomoAlerts(company.ticker),
      api.fetchOpinionLeaders(company.ticker),
      api.fetchRealtimeComments(company.ticker, 5),
      api.fetchDailyBriefing(company.ticker),
      api.fetchHourlySentiment(company.ticker),
    ]);

    // 백엔드 응답을 Stock 타입으로 변환
    return {
      id: company.id,
      company,
      score: sentiment.score,
      sentimentPriceData: mergeSentimentAndPrice(sentimentTrend, stockPrice),
      aiSummary,
      realtimeSummary: sentiment.summary,
      keyKeywords: keywords,
      chartData: hourlySentiment,
      debates: [], // TODO: 백엔드에서 제공 시 추가
      peerComparison: [], // TODO: 백엔드에서 제공 시 추가
      rawComments: comments,
      fomoAlerts: fomoAlerts,
      narratives: narratives,
      opinionLeaders: opinionLeaders,
      sentimentComparison: {
        current: sentiment.score,
        previous: sentiment.previousScore,
        change: sentiment.change,
      },
      dailyBriefing: briefing,
    };
  } catch (error) {
    console.error('백엔드 API 호출 실패, Mock 데이터 사용:', error);
    return generateMockStock(company);
  }
}

// 감정 데이터와 주가 데이터 병합
function mergeSentimentAndPrice(sentimentTrend: any[], stockPrice: any[]) {
  return sentimentTrend.map((item, index) => ({
    date: item.date,
    positive: item.positive,
    negative: item.negative,
    stockPrice: stockPrice[index]?.close || 0,
  }));
}
